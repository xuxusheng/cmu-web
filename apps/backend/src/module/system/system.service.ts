import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { execSync } from 'child_process'
import dayjs from 'dayjs'
import {
  chmodSync,
  existsSync,
  lstatSync,
  readFileSync,
  writeFileSync
} from 'fs'
import { parse } from 'ini'
import ipAddr from 'ipaddr.js'
import { address, route } from 'iproute'
import Netplan from 'netplan-js'
import { cpus, freemem, networkInterfaces, totalmem, uptime } from 'os'
import { join } from 'path'
import { gMmsConfig } from '../core/config/g-mms.config'
import { InternalServerErrorException } from '../core/exception/custom-exception'
import { ProcessStatus } from '../shared/interface/system'
import { RunnerService } from '../shared/service/runner.service'
import { SetSystemTimeDto } from './dto/set-system-time.dto'
import { UpdateIpAddressDto } from './dto/update-ip-address.dto'

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name)

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>,
    private runnerService: RunnerService
  ) {}

  /**
   * 设置系统时间
   */
  setSystemTime = async (dto: SetSystemTimeDto) => {
    const systemTime = dayjs(dto.systemTime).unix()

    this.logger.log(`设置系统时间：/bin/date -s @${systemTime}`)

    // 发送命令到 runner，修改时间
    await this.runnerService.runCmd(`/bin/date -s @${systemTime}`)

    // 将系统时间写入硬件时间
    await this.runnerService.runCmd('hwclock -w')
  }

  /**
   * 获取网卡信息
   */
  getNetworkInterfaces = () => {
    return networkInterfaces()
  }

  getIpAddress = () => address.show()

  // 通过网卡名称查询网卡信息
  getIpAddressByName = (name: string) => address.show({ dev: name })

  // 更新网卡信息
  updateIpAddressByName = async (name: string, dto: UpdateIpAddressDto) => {
    const { ip, netmask, gateway } = dto

    const prefix = ipAddr.IPv4.parse(netmask).prefixLengthFromSubnetMask()

    const netplan = new Netplan()

    await netplan.loadConfigs()

    netplan.setInterface('ethernets', name, {
      dhcp4: 'no',
      addresses: [`${ip}/${prefix}`],
      gateway4: gateway
    })

    await netplan.writeConfigs()

    // 容器中无法执行 netplan apply，先注释掉
    // await netplan.apply()

    // 通过 runner 执行 netplan apply
    // await this.runnerService.runCmd('netplan try')
    await this.runnerService.runCmd('netplan apply')
  }

  getIpRoute = () => route.show()

  // 获取 CPU 信息
  // getCPUInfo = () => {
  //   const data = readFileSync('/proc/uptime').toString()
  //   const out = execSync("grep -cEi '^processor\\s*:\\s*[0-9]+' /proc/cpuinfo")
  //     .toString()
  //     .trim()
  //   const cpuNum = parseInt(out)
  //   const arr = data.split(/\s+/)
  //   const runTime = parseInt(arr[0])
  //   // fixme: string 怎么除 number ？？？？
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const freeTime = parseFloat((arr[1] / cpuNum).toFixed(2))
  //   // fixme: string 怎么除 number ？？？？
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const cpuFree = parseFloat(((100 * arr[1]) / cpuNum / arr[0]).toFixed(2))
  //
  //   return { runTime, freeTime, cpuNum, cpuFree }
  // }

  getCpu = () => cpus()

  getMemory = () => ({
    total: totalmem(),
    free: freemem()
  })

  getUptime = () => uptime()

  // // 获取内存信息
  // getMemoryInfo = () => {
  //   const out = execSync("head -2 /proc/meminfo |awk -vORS=' ' '{print $2}'")
  //     .toString()
  //     .trim()
  //   const arr = out.split(/\s+/)
  //   // fixme: string 怎么除 number ？？？？
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const totalMem = (arr[0] / (2 << 9)).toFixed(2)
  //   // fixme: string 怎么除 number ？？？？
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const freeMem = (arr[1] / (2 << 9)).toFixed(2)
  //   // fixme: string 怎么除 number ？？？？
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   const freePercent = parseFloat(((100 * freeMem) / totalMem).toFixed(2))
  //
  //   return { totalMem, freeMem, freePercent }
  // }
  //
  // // 获取存储信息
  // getDiskInfo = () => {
  //   const out = execSync('df -h').toString().trim()
  //   const arr = out.split(/\n|\r\n/)
  //   arr.pop()
  //
  //   const RET = []
  //   for (const line of arr) {
  //     const diskItem = {}
  //     const list = line.split(/\s+/)
  //     if (list.length == 0) continue
  //
  //     diskItem['fileSystem'] = list[0].trim()
  //     diskItem['size'] = list[1].trim()
  //     diskItem['used'] = list[2].trim()
  //     diskItem['avail'] = list[3].trim()
  //     diskItem['useRatio'] = list[4].trim()
  //     diskItem['mountedOn'] = list[5].trim()
  //
  //     RET.push(diskItem)
  //   }
  //
  //   return RET
  // }

  // 查询几个业务进程的状态
  getProcessStatus = (): Promise<ProcessStatus[]> => {
    // 先读取 monitor.ini 文件，查询三个进程的名称
    const monitorIniPath = join(this.gMmsConf.gMmsHome, 'monitor.ini')

    if (!existsSync(monitorIniPath)) {
      throw new InternalServerErrorException(
        `获取进程状态失败：文件 ${monitorIniPath} 不存在`
      )
    }

    const monitorIni = parse(readFileSync(monitorIniPath, 'utf-8'))

    const iedProcName = monitorIni['ied_proc']
    const i2ProcName = monitorIni['i2_proc']
    const ntpProcName = monitorIni['ntp_proc']

    return Promise.all(
      [iedProcName, i2ProcName, ntpProcName]
        // 如果 monitor.ini 文件中的值为空，就不展示此进程相关信息
        .filter((v) => !!v)
        .map(this.getProcessStatusByName)
    )
  }

  // 通过名称查询进程状态
  getProcessStatusByName = async (procName: string): Promise<ProcessStatus> => {
    // 通过名称拿到进程号
    const pid = await this.getPidByProcessName(procName)

    if (!pid) {
      // 如果进程号文件不存在，直接判定为未启动
      return { procName, pid: '', isRunning: false, runTime: 0 }
    }

    // 从 /host/proc/ 目录下读取进程信息
    const procDir = join('/host/proc', pid)

    // 目录不存在说明进程未启动
    if (!existsSync(procDir)) {
      return { procName, pid: '', isRunning: false, runTime: 0 }
    }

    // 目录存在时，通过目录的修改时间计算运行时间
    const stats = lstatSync(procDir, { throwIfNoEntry: false })

    return {
      procName,
      pid,
      isRunning: true,
      runTime: Math.floor((Date.now() - stats.mtimeMs) / 1000)
    }
  }

  // 通过名称查询 pid 号
  getPidByProcessName = (procName: string) => {
    const cmd = `ps -ef | grep ${procName} | grep -v grep | awk '{print $2}'`
    return this.runnerService.runCmd(cmd)
  }

  // 重启进程
  restartProcess = async (processName: string) => {
    const pid = await this.getPidByProcessName(processName)

    if (!pid) {
      // 如果 pid 不存在，也不存在 kill 一说，直接返回
      return
    }

    // 容器中无法执行 kill 命令，通过外部 runner 来执行
    return this.runnerService.runCmd(`kill -9 ${pid}`)

    // kill 掉后，有其他脚本来负责重启
  }

  // 查询主机 Hash
  getLicenseHash = () => {
    const path = join(this.gMmsConf.gMmsBinHome, 'license_hash')

    if (!existsSync(path)) {
      throw new Error(`文件 ${path} 不存在`)
    }

    // 确保一下文件具有执行权限
    chmodSync(path, '777')

    // 执行 path 对应的路径的文件，获取输出
    return execSync(path).toString().trim()
  }

  // 查询 license
  getLicense = () => {
    const path = join(this.gMmsConf.gMmsBinHome, 'ied.license')

    if (!existsSync(path)) {
      return ''
    }

    return readFileSync(path).toString()
  }

  // 写入 license
  setLicense = (license: string) => {
    const path = join(this.gMmsConf.gMmsBinHome, 'ied.license')
    writeFileSync(path, license)
  }

  // 重启系统
  reboot = () => this.runnerService.runCmd('reboot')
}
