import { XMLParser } from 'fast-xml-parser'
import { readFileSync } from 'fs'

export const getLogDirAndFileName = (gMmsEtcHome: string) => {
  const data = readFileSync(`${gMmsEtcHome}/logcfg.xml`).toString()
  const parser = new XMLParser()
  const json = parser.parse(data)
  const ctrlNode = json?.LOG_CFG?.LogControl
  if (!ctrlNode) throw new Error('load logcfg.xml failed!')

  return { logDir: ctrlNode.LogDir, logFile: ctrlNode.LogFileName }
}
