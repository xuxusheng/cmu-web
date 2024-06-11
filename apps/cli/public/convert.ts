// import fs, { readFileSync } from 'fs'
// import { exit } from 'process'
// import xml2js from 'xml2js'
// import { IcdXml } from '../lib/command/generate/icd'
//
// function ParseLdInfo(ldInfoFilePath: string): {
//   IEDName: string
//   LDevice: string
//   LDevice_desc: string
//   GroupNoStartID: string
// }[] {
//   const text = fs.readFileSync(ldInfoFilePath).toString()
//   const ldInfo = []
//   for (const line of text.split('\n')) {
//     const [IEDName, LDevice, LDevice_desc, GroupNoStartID] = line.split(/\s+/)
//     if (IEDName) {
//       ldInfo.push({
//         IEDName,
//         LDevice,
//         LDevice_desc,
//         GroupNoStartID
//       })
//     }
//   }
//
//   return ldInfo
// }
//
// function ParseNameInfo(nameFilePath: string) {
//   const text = fs.readFileSync(nameFilePath).toString()
//   const namesVec = []
//   for (const [index, line] of text.split('\n').entries()) {
//     const arr = line.split(/\s+/)
//     if (arr.length <= 3) {
//       console.log(`length size ${arr.length} <= 3, arr is: "${arr.join(' ')}`)
//       continue
//     }
//
//     const [vcard_id, group_no, vcard_desc, ...subNames] = arr
//     namesVec.push({
//       vcard_id: Number(vcard_id),
//       vcard_desc,
//       subNames
//     })
//   }
//
//   return namesVec
// }
//
// function Replace(
//   icd: IcdXml,
//   ldInfoFromExcel: Array<{
//     IEDName: string
//     LDevice: string
//     LDevice_desc: string
//     GroupNoStartID: string
//   }>,
//   lnDescriptionFromExcel: Array<{
//     vcard_id: number
//     vcard_desc: string
//     subNames: string[]
//   }>,
//   level: number
// ) {
//   const iedNode = icd.SCL.IED
//   // console.log(iedNode);
//   const accNode = iedNode[0].AccessPoint[0]
//   // console.log(accNode);
//   const servNode = accNode.Server[0]
//   const ldNode = servNode.LDevice
//   if (ldNode.length != 1) {
//     throw new Error(`error ldNode count ${ldNode.length}`)
//   }
//
//   const jstr = JSON.stringify(ldNode[0])
//   const ldDevice = []
//   for (const [ldIdx, ldInfo] of ldInfoFromExcel.entries()) {
//     const o = JSON.parse(jstr)
//     const ldInst = ldInfo.LDevice
//     o.$.desc = ldInfo.LDevice_desc
//     o.$.inst = ldInst
//
//     let addr = Number(ldInfo.GroupNoStartID)
//     const ln0 = o.LN0[0]
//     for (const ds of ln0.DataSet) {
//       for (const fcda of ds.FCDA) fcda.$.ldInst = ldInst
//     }
//     for (const lc of ln0.LogControl) {
//       lc.$.logName = ldInst
//     }
//
//     let lnIdx = 0
//     for (const ln of o.LN) {
//       const group = ln?.Private?.[0]?.$
//       if (!group) continue
//       if (!group['whjy:Group']) continue
//
//       ln.$.desc = `${ldInfo.LDevice_desc}_${lnDescriptionFromExcel[lnIdx]?.vcard_desc}|${lnDescriptionFromExcel[lnIdx]?.subNames?.[ldIdx]}`
//       group['whjy:Group'] = addr
//       ++addr
//       ++lnIdx
//
//       if (level == 1 || level == 3) {
//         for (const doi of ln.DOI) {
//           doi.$.desc = `${ln.$.desc}|${doi.$.desc}`
//         }
//       }
//
//       if (level == 2 || level == 3) {
//         for (const doi of ln.DOI) {
//           for (const dai of doi.DAI) {
//             if (dai.$?.name == 'dU' && dai.Val?.[0]) {
//               const v = dai.Val[0]
//               dai.Val[0] = `${ln.$.desc}|${v}`
//             }
//           }
//         }
//       }
//     }
//
//     ldDevice.push(o)
//   }
//
//   servNode.LDevice = ldDevice
//
//   // convert JSON objec to XML
//   const builder = new xml2js.Builder()
//   const xml = builder.buildObject(icd)
//   const outfile = 'aa.icd'
//   // write updated XML string to a file
//   fs.writeFile(outfile, xml, (err) => {
//     if (err) {
//       throw err
//     }
//
//     console.log(`Updated XML is written to a new file ${outfile}.`)
//   })
// }
//
// async function main(
//   ldInfoFilePath: string,
//   nameFilePath: string,
//   templateIcdFilePath: string,
//   level: number
// ) {
//   const ldInfoFromExcel = ParseLdInfo(ldInfoFilePath)
//   const lnDescriptionFromExcel = ParseNameInfo(nameFilePath)
//
//   const xmlString = readFileSync(templateIcdFilePath, 'utf-8').toString()
//   const xml = await xml2js.parseStringPromise(xmlString)
//   Replace(xml, ldInfoFromExcel, lnDescriptionFromExcel, level || 0)
//
//   //    console.log(ldInfos)
//   fs.readFile(templateIcdFilePath, 'utf-8', (err, data) => {
//     if (err) throw err
//
//     xml2js.parseString(data, (err, res) => {
//       if (err) throw err
//
//       Replace(res, ldInfoFromExcel, lnDescriptionFromExcel, level || 0)
//     })
//   })
// }
//
// if (process.argv.length < 5) {
//   console.warn(`usage: ${process.argv[0]} ldInfo.txt names.txt xxx.icd level`)
//   exit(-1)
// }
