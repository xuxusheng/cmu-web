import fs from 'fs'
import { exit } from 'process'
import xml2js from 'xml2js'

function ParseLdInfo(ldInfoFilePath) {
  const text = fs.readFileSync(ldInfoFilePath).toString()
  let ldInfo = []
  for (const line of text.split('\n')) {
    const [iedName, ldName, ldDesc, sAddr] = line.split(/\s+/)
    if (iedName) ldInfo.push({ iedName, ldName, ldDesc, sAddr })
  }

  return ldInfo
}

function ParseNameInfo(nameFilePath) {
  const text = fs.readFileSync(nameFilePath).toString()
  let namesVec = []
  for (const [index, line] of text.split('\n').entries()) {
    let arr = line.split(/\s+/)
    if (arr.length <= 3) {
      console.log(`length size ${arr.length} <= 3, arr is: "${arr.join(' ')}`)
      continue
    }

    let o = { index, lnDesc: arr[2], subNames: arr.splice(3) }

    namesVec.push(o)
  }

  return namesVec
}

function Replace(icd, ldInfos, names, level) {
  let iedNode = icd.SCL.IED
  // console.log(iedNode);
  let accNode = iedNode[0].AccessPoint[0]
  // console.log(accNode);
  let servNode = accNode.Server[0]
  let ldNode = servNode.LDevice
  if (ldNode.length != 1) {
    throw new Error(`error ldNode count ${ldNode.length}`)
  }

  const jstr = JSON.stringify(ldNode[0])
  let ldDevice = []
  for (const [ldIdx, ldInfo] of ldInfos.entries()) {
    let o = JSON.parse(jstr)
    const ldInst = ldInfo.ldName
    o.$.desc = ldInfo.ldDesc
    o.$.inst = ldInst

    let addr = ldInfo.sAddr
    let ln0 = o.LN0[0]
    for (let ds of ln0.DataSet) {
      for (let fcda of ds.FCDA) fcda.$.ldInst = ldInst
    }
    for (let lc of ln0.LogControl) {
      lc.$.logName = ldInst
    }

    let lnIdx = 0
    for (let ln of o.LN) {
      let group = ln?.Private?.[0]?.$
      if (!group) continue
      if (!group['whjy:Group']) continue

      ln.$.desc = `${ldInfo.ldDesc}_${names[lnIdx]?.lnDesc}|${names[lnIdx]?.subNames?.[ldIdx]}`
      group['whjy:Group'] = addr
      ++addr
      ++lnIdx

      if (level == 1 || level == 3) {
        for (let doi of ln.DOI) {
          doi.$.desc = `${ln.$.desc}|${doi.$.desc}`
        }
      }

      if (level == 2 || level == 3) {
        for (let doi of ln.DOI) {
          for (let dai of doi.DAI) {
            if (dai.$?.name == 'dU' && dai.Val?.[0]) {
              const v = dai.Val[0]
              dai.Val[0] = `${ln.$.desc}|${v}`
            }
          }
        }
      }
    }

    ldDevice.push(o)
  }

  servNode.LDevice = ldDevice

  // convert JSON objec to XML
  const builder = new xml2js.Builder()
  const xml = builder.buildObject(icd)
  const outfile = 'aa.icd'
  // write updated XML string to a file
  fs.writeFile(outfile, xml, (err) => {
    if (err) {
      throw err
    }

    console.log(`Updated XML is written to a new file ${outfile}.`)
  })
}

function main(ldInfoFilePath, nameFilePath, templateIcdFilePath, level) {
  const ldInfos = ParseLdInfo(ldInfoFilePath)
  const names = ParseNameInfo(nameFilePath)
  //    console.log(ldInfos)
  fs.readFile(templateIcdFilePath, 'utf-8', (err, data) => {
    if (err) throw err

    xml2js.parseString(data, (err, res) => {
      if (err) throw err

      Replace(res, ldInfos, names, level || 0)
    })
  })
}

if (process.argv.length < 5) {
  console.warn(`usage: ${process.argv[0]} ldInfo.txt names.txt xxx.icd level`)
  exit(-1)
}
main(...process.argv.slice(2))
