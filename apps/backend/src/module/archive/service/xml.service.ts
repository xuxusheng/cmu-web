import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { readFileSync, readdirSync, writeFileSync } from 'fs'

import * as ini from 'ini'

import { gMmsConfig } from '../../core/config/g-mms.config'

@Injectable()
export class XmlService {
  private readonly logger = new Logger(XmlService.name)

  constructor(
    @Inject(gMmsConfig.KEY)
    private gMmsConf: ConfigType<typeof gMmsConfig>
  ) {}

  getFormattedData = (root, keys) => {
    const o = {}
    for (const key of keys) {
      const node = root[key]
      if (!node) continue

      for (const [k, v] of Object.entries(node)) {
        o[`${key}_${k}`] = v
      }
    }

    return o
  }

  getMMSConfigData = () => {
    const data = readFileSync(
      `${this.gMmsConf.gMmsEtcHome}/mms_config.xml`
    ).toString()
    const parser = new XMLParser()
    const json = parser.parse(data)
    const root = json.MMS_CFG
    const keys = ['MmsFile', 'MmsLog', 'MmsReport', 'SclFile']
    const RET = this.getFormattedData(root, keys)
    return { mms_cfg_info: RET, icd_cfg_info: this.getIedNameAndAP() }
  }

  getLogConfigData = () => {
    const data = readFileSync(
      `${this.gMmsConf.gMmsEtcHome}/logcfg.xml`
    ).toString()
    const parser = new XMLParser()
    const json = parser.parse(data)
    const root = json.LOG_CFG
    const keys = ['LogControl']
    return this.getFormattedData(root, keys)
  }

  getNTPConfigData = () => {
    const data = readFileSync(`${this.gMmsConf.gMmsEtcHome}/ntp.ini`).toString()
    const content = ini.parse(data)
    content.ntp.sync_cycle = +content.ntp.sync_cycle
    content.ntp.out_time = +content.ntp.out_time
    content.ntp.is_use_sharedMem = +content.ntp.is_use_sharedMem
    return content.ntp
  }

  getIedNameAndAP = () => {
    const RET = {}
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })

    readdirSync(this.gMmsConf.gMmsIcdHome, { withFileTypes: true })
      .filter((item, index) => item.isFile() && index < 5)
      .filter((item) => item.name.match(/\.icd$/))
      .map((item) => {
        const data = readFileSync(
          `${this.gMmsConf.gMmsIcdHome}/${item.name}`
        ).toString()
        try {
          const json = parser.parse(data)
          return {
            name: item.name,
            o: json?.SCL?.Communication?.SubNetwork?.ConnectedAP
          }
        } catch (e) {
          console.log(`read file ${item.name} failed: `, e.message)
          return null
        }
      })
      .filter((o) => !!o?.o)
      .forEach((o) => {
        // fixme: 类型需要优化
        const item: {
          iedName?: string
          AP?: string[]
        } = {}
        if (Array.isArray(o.o)) {
          item.AP = []
          for (const ap of o.o) {
            item.iedName = ap['@_iedName']
            item.AP.push(ap['@_apName'])
          }
        } else {
          item.iedName = o.o['@_iedName']
          item.AP = [o.o['@_apName']]
        }

        RET[o.name] = item
      })

    return RET
  }

  writeXMLConfigData = (cfg, filename, rootTag) => {
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      // fixme: 并没有这个参数？？？
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      allowBooleanAttributes: true,
      suppressBooleanAttributes: true
    })
    const originalData = readFileSync(
      `${this.gMmsConf.gMmsEtcHome}/${filename}`
    ).toString()
    const parser = new XMLParser({
      ignoreAttributes: false,
      allowBooleanAttributes: true
    })
    const data = parser.parse(originalData)
    const root = data[rootTag]
    for (const [k, v] of Object.entries(cfg)) {
      const [k1, k2] = k.split('_')
      root[k1][k2] = v
    }

    const xmlstr = builder.build(data)
    writeFileSync(`${this.gMmsConf.gMmsEtcHome}/${filename}`, xmlstr)
  }

  writeMMSConfigData = (cfg) => {
    this.writeXMLConfigData(cfg, 'mms_config.xml', 'MMS_CFG')
  }

  writeLogConfigData = (cfg) => {
    this.writeXMLConfigData(cfg, 'logcfg.xml', 'LOG_CFG')
  }

  writeNTPConfigData = (cfg) => {
    const strVec = ['[ntp]']
    // fixme: 这种对 v 赋值的写法，没有起作用啊？？？
    // eslint-disable-next-line prefer-const
    for (let [k, v] of Object.entries(cfg)) {
      if (typeof v === typeof true) {
        v = v ? 1 : 0
      }
      strVec.push(`${k} = ${v}`)
    }

    writeFileSync(`${this.gMmsConf.gMmsEtcHome}/ntp.ini`, strVec.join('\n'))
  }
}
