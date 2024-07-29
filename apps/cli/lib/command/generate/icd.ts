import { readFileSync } from 'fs'
import { existsSync } from 'node:fs'
import ora from 'ora'
import { exit } from 'process'
import xml2js from 'xml2js'
import { logger } from '../../utils/logger'

export const parseIcdXml = async (icdFilePath: string) => {
  if (!existsSync(icdFilePath)) {
    logger.error('ICD 文件不存在，路径：', [icdFilePath])
    exit()
  }

  const loading = ora(`正在解析 ICD 文件，文件路径：${icdFilePath}`).start()

  const xmlString = readFileSync(icdFilePath, 'utf-8').toString()
  const xml = (await xml2js.parseStringPromise(xmlString)) as IcdXml

  loading.succeed('ICD 文件解析完成')

  return xml
}

export type IcdXml = {
  SCL: {
    $: {
      xmlns: string
      'xmlns:xsd': string
      'xmlns:xsi': string
      'xmlns:ext': string
      'xmlns:whjy': string
      'xsi:schemaLocation': string
    }
    Header: Array<{
      $: {
        id: string
        nameStructure: string
        toolID: string
        version: string
        revision: string
      }
      History: Array<{
        Hitem: Array<{
          $: {
            when: string
            version: string
            revision: string
            what: string
            who: string
          }
        }>
      }>
    }>
    Communication: Array<{
      SubNetwork: Array<{
        $: {
          type: string
          name: string
        }
        Text: Array<string>
        BitRate: Array<{
          _: string
          $: {
            unit: string
          }
        }>
        ConnectedAP: Array<{
          $: {
            iedName: string
            apName: string
          }
          Address: Array<{
            P: Array<{
              _: string
              $: {
                type: string
              }
            }>
          }>
        }>
      }>
    }>
    IED: Array<{
      $: {
        name: string
        desc: string
        manufacturer: string
        configVersion: string
      }
      Services: Array<{
        DynAssociation: Array<string>
        GetDirectory: Array<string>
        GetDataObjectDefinition: Array<string>
        GetDataSetValue: Array<string>
        DataSetDirectory: Array<string>
        ReadWrite: Array<string>
        ConfDataSet: Array<{
          $: {
            max: string
            maxAttributes: string
          }
        }>
        ConfReportControl: Array<{
          $: {
            max: string
          }
        }>
        ReportSettings: Array<{
          $: {
            bufTime: string
            cbName: string
            rptID: string
            datSet: string
            intgPd: string
            optFields: string
          }
        }>
        ConfLogControl: Array<{
          $: {
            max: string
          }
        }>
      }>
      AccessPoint: Array<{
        $: {
          name: string
        }
        Server: Array<{
          Authentication: Array<string>
          LDevice: Array<{
            $: {
              inst: string
              desc: string
            }
            LN0: Array<{
              $: {
                desc: string
                inst: string
                lnType: string
                lnClass: string
              }
              DataSet: Array<{
                $: {
                  name: string
                  desc: string
                }
                FCDA: Array<{
                  $: {
                    ldInst: string
                    lnClass: string
                    lnInst: string
                    doName: string
                    fc: string
                  }
                }>
              }>
              ReportControl: Array<{
                $: {
                  name: string
                  desc: string
                  rptID: string
                  datSet: string
                  confRev: string
                  buffered: string
                  intgPd: string
                  bufTime: string
                }
                TrgOps: Array<{
                  $: {
                    period: string
                    dchg: string
                    qchg: string
                    dupd: string
                  }
                }>
                OptFields: Array<{
                  $: {
                    dataRef: string
                    reasonCode: string
                    dataSet: string
                    entryID: string
                    timeStamp: string
                  }
                }>
                RptEnabled: Array<{
                  $: {
                    max: string
                  }
                }>
              }>
              LogControl: Array<{
                $: {
                  desc: string
                  name: string
                  datSet: string
                  logName: string
                  logEna: string
                  intgPd: string
                }
                TrgOps: Array<{
                  $: {
                    dchg: string
                    qchg: string
                  }
                }>
              }>
              SettingControl: Array<{
                $: {
                  numOfSGs: string
                  actSG: string
                }
              }>
            }>
            LN: Array<{
              $: {
                desc: string
                inst: string
                lnType: string
                lnClass: string
              }
              Private?: Array<{
                $: {
                  'whjy:LnFunc': string
                  'whjy:Group': string
                }
              }>
              DOI?: Array<{
                $: {
                  desc: string
                  name: string
                }
                Private: Array<{
                  $: {
                    'whjy:Func': string
                  }
                }>
                SDI?: Array<{
                  $: {
                    name: string
                  }
                  DAI: Array<{
                    $: {
                      name: string
                      sAddr?: string
                    }
                    Val?: Array<string>
                  }>
                }>
                DAI: Array<{
                  $: {
                    name: string
                    sAddr?: string
                  }
                  Val?: Array<string>
                }>
              }>
            }>
          }>
        }>
      }>
    }>
    DataTypeTemplates: Array<{
      LNodeType: Array<{
        $: {
          lnClass: string
          desc: string
          id: string
        }
        DO: Array<{
          $: {
            name: string
            type: string
            desc: string
          }
        }>
      }>
      DOType: Array<{
        $: {
          id: string
          cdc: string
          desc: string
        }
        DA: Array<{
          $: {
            bType: string
            name: string
            fc: string
            dchg?: string
            qchg?: string
            type?: string
          }
          Val?: Array<string>
        }>
      }>
      DAType: Array<{
        $: {
          id: string
        }
        BDA: Array<{
          $: {
            bType: string
            name: string
            type?: string
          }
        }>
      }>
      EnumType: Array<{
        $: {
          id: string
        }
        EnumVal: Array<{
          _?: string
          $: {
            ord: string
          }
        }>
      }>
    }>
  }
}
