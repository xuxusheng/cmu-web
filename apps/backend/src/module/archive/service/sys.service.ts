import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { spawnSync } from 'child_process'
import { lstatSync, readFileSync, writeFileSync } from 'fs'
import net from 'net'
import YAML from 'yaml'

import { gMmsConfig } from '../../core/config/g-mms.config'

const netplanFilePath = '/etc/netplan/01-network-manager-all.yaml'
const netConfigFilePath = '/etc/network/interfaces'

@Injectable()
export class SysService {
  private readonly logger = new Logger(SysService.name)

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  isX64 = () => {
    return process.arch === 'x64'
  }

  reboot = () => {
    const { error: err } = spawnSync('/sbin/reboot')
    if (err) throw err
  }

  getNetParam = () => {
    // return this.IsX64() ? this.GetNetParamUbuntu() : this.GetNetParamArm()
    return this.getNetGeneral('eth')
  }

  getNetGeneral = (ifPrefix) => {
    const out = spawnSync('ip', ['a'])
    if (out.error) throw out.error

    const ss = out.stdout.toString().split('\n')
    const RET = []
    // fixme: 类型定义需要完善
    let ifParam: {
      eth?: string
      address?: string
      netmask?: number
    } = {}
    for (const line of ss) {
      let m = /^\d:\s+(\w+):/.exec(line)
      if (m) {
        ifParam = {}
        const eth = m[1]
        console.log(`eth: ${eth}`)
        if (eth.startsWith(ifPrefix)) ifParam.eth = eth

        continue
      }

      if (!ifParam.eth) continue

      m = /^\s*inet ([.\d]+)\/(\d+) /.exec(line)
      if (m) {
        ifParam.address = m[1]
        ifParam.netmask = +m[2]
        console.log(`addr: ${ifParam.address}, netmask:${ifParam.netmask}`)
        RET.push(ifParam)
      }
    }

    return RET
  }

  getNetParamUbuntu = () => {
    function subnet2Mask(val) {
      return [255, 255, 255, 255]
        .map(() =>
          [...Array.from({ length: 8 }).keys()].reduce(
            // fixme: 有问题，number 和 bool 相加？
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (rst) => rst * 2 + (val-- > 0),
            0
          )
        )
        .join('.')
    }

    const ss = readFileSync(netplanFilePath, 'utf-8')
    // fixme: 类型定义需要完善
    const json = YAML.parse(ss) as {
      network: {
        ethernets: {
          [key: string]: {
            addresses: string[]
            gateway4: string
          }
        }
      }
    }
    const RET = []
    for (const [k, v] of Object.entries(json?.network?.ethernets)) {
      if (v.addresses.length === 0) continue
      // fixme: 类型定义需要完善
      const item: {
        eth?: string
        address?: string
        netmask?: string
        gateway?: string
      } = { eth: k }
      const addrStr = v.addresses[0]
      const [ip, ss] = addrStr.split('/')
      item.address = ip
      item.netmask = subnet2Mask(+ss)
      item.gateway = v.gateway4
      RET.push(item)
    }

    return RET
  }

  getNetParamArm = () => {
    const lines = readFileSync(netConfigFilePath).toString().split('\n')
    const RET = []
    const ifNameRe = /^auto\s+(\w+)/
    const addressRe = /^address\s+([.\d]+)/
    const maskRe = /^netmask\s+([.\d]+)/
    const gatewayRe = /^gateway\s+([.\d]+)/
    let row: {
      eth?: string
      address?: string
      netmask?: string
      gateway?: string
    } = {}
    for (const line of lines) {
      let m = ifNameRe.exec(line)
      if (m) {
        row = {}
        row.eth = m[1]
        continue
      }

      m = addressRe.exec(line)
      if (m) {
        row.address = m[1]
        continue
      }

      m = maskRe.exec(line)
      if (m) {
        row.netmask = m[1]
        continue
      }

      m = gatewayRe.exec(line)
      if (m) {
        row.gateway = m[1]
        RET.push(row)
        row = {}
        continue
      }
    }

    return RET
  }

  checkNetParamValidation = (param) => {
    const no255 = param.netmask
      .split('.')
      .filter((s) => s !== '255' && s !== '0')
      .map((s) => parseInt(s))
      // fixme: & 运算符用来做什么？
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .filter((v) => v & (v - 1 !== 0))

    return (
      no255.length === 0 &&
      net.isIPv4(param.address) &&
      net.isIPv4(param.gatewayRe)
    )
  }

  setNetParam = (params) => {
    // return this.IsX64() ? this.SetNetParamUbuntu(params) : this.SetNetParamArm(params)
    return this.setNetParamGeneral(params)
  }

  setNetParamGeneral = (params) => {
    const datas = this.getNetGeneral('eth')
    for (const data of datas) {
      if (data.eth == params.eth) {
        data.address = params.address
        data.netmask = params.netmask
        break
      }
    }

    const outFilePath = `${this.gMmsConf.gMmsHome}/ip.sh`
    const cmds = []
    for (const param of datas) {
      const cmd = `ip addr add ${param.address}/${param.netmask} dev ${param.eth}\n`
      cmds.push(cmd)
      cmds.push(`ip link set ${param.eth} up\n`)
    }

    writeFileSync(outFilePath, cmds.join(''))
  }

  setNetParamUbuntu = (param) => {
    function mask2Subnet(mask) {
      return mask
        .split('.')
        .reduce(
          (nbb, byte) =>
            [...Array(8).reverse().keys()].reduce(
              (nb, i) => nb + ((byte >> i) & 1),
              nbb
            ),
          0
        )
    }

    let ss = readFileSync(netplanFilePath, 'utf-8')
    const json = YAML.parse(ss)
    const node = json?.network?.ethernets
    if (!node) throw new Error('error net config file!!!')

    const o = node[param.eth]
    if (!o) throw new Error(`cannot find device ${param.eth}`)

    const subnet = mask2Subnet(param.netmask)
    o.addresses = [`${param.address}/${subnet}`]
    o.gateway4 = param.gateway

    // function replacer(key, value) {
    //     if(Array.isArray(value))
    //         return Object.stringify(value)
    //     else
    //         return value;
    // }
    ss = YAML.stringify(json)
    writeFileSync(netplanFilePath, ss)
  }

  isAlreadyRegisted = () => {
    let out = spawnSync(`${this.gMmsConf.gMmsHome}/monitor.showied`)
    if (out.error) throw out.error

    const procName = out.stdout.toString().trimEnd()
    out = spawnSync(`pidof ${procName}`)
    if (out.error) {
      this.logger.warn(
        `pidof ${procName} print ${out.stderr.toString().trimEnd()}`
      )
      throw out.error
    }
  }

  getHashString = () => {
    try {
      const out = spawnSync(`${this.gMmsConf.gMmsBinHome}/license_hash`)
      if (out.error) {
        this.logger.warn(
          `get hash error, return ${out.stderr?.toString().trimEnd()}`
        )
        throw out.error
      }
      return { ied_hash: out.stdout.toString().trimEnd() }
    } catch (e) {
      console.log(`exec license_hash failed:`, e.message)
      throw e
    }
  }

  setHashString = (key) => {
    // fixme: spawnSync 的参数有问题，没有第二个字符串参数
    const out = spawnSync(
      `${this.gMmsConf.gMmsBinHome}/license_hash`
      // `dstfile`
    )
    if (out.error) {
      this.logger.warn(
        `get hash dstfile error, return ${out.stderr?.toString().trimEnd()}`
      )
      throw out.error
    }

    const filePath = out.stdout.toString().trimEnd()
    writeFileSync(filePath, key)
  }

  getProcStatus = () => {
    const nameArr = ['ied', 'ntp', 'i2']
    const RET = []
    for (const name of nameArr) {
      const out = spawnSync(`${this.gMmsConf.gMmsHome}/monitor.sh`, [
        `show${name}`
      ])
      if (out.error) {
        this.logger.warn(
          `exec ${
            this.gMmsConf.gMmsHome
          }/monitor.sh failed, get ${name} status error, return ${out.stderr
            ?.toString()
            .trimEnd()}`
        )
        continue
      }
      const procName = out.stdout.toString().trimEnd()
      let isRunning = false
      let runTime = ''
      if (procName.length == 0) continue

      const pid = readFileSync(`${this.gMmsConf.gMmsPidHome}/${procName}.pid`)
        .toString()
        .trim()
      const procDir = `/proc/${pid}`
      const o = lstatSync(procDir, { throwIfNoEntry: false })
      if (pid && o?.isDirectory()) {
        isRunning = true

        // fixme: number 怎么减 Date ？
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const elapse = Date.now() - o.mtime
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        runTime = elapse / 1000
      }

      RET.push({ procName, pid, isRunning, runTime })
    }

    return RET
  }

  restartProc = (procName) => {
    const pid = readFileSync(`/${this.gMmsConf.gMmsPidHome}/${procName}.pid`)
      .toString()
      .trim()
    const out = spawnSync(`kill`, ['-9', pid])
    if (out.error) {
      this.logger.warn(
        `kill ${pid} error, return ${out.stderr.toString().trimEnd()}`
      )
      throw out.error
    }

    this.logger.log(`restart ${procName} success.`)
  }
}
