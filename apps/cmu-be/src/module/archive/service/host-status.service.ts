import { Injectable } from '@nestjs/common'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

@Injectable()
export class HostStatusService {
  getCPUInfo = () => {
    const data = readFileSync('/proc/uptime').toString()
    const out = execSync("grep -cEi '^processor\\s*:\\s*[0-9]+' /proc/cpuinfo")
      .toString()
      .trim()
    const cpuNum = parseInt(out)
    const arr = data.split(/\s+/)
    const runTime = parseInt(arr[0])
    // fixme: string 怎么除 number ？？？？
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const freeTime = parseFloat((arr[1] / cpuNum).toFixed(2))
    // fixme: string 怎么除 number ？？？？
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cpuFree = parseFloat(((100 * arr[1]) / cpuNum / arr[0]).toFixed(2))

    return { runTime, freeTime, cpuNum, cpuFree }
  }

  getMemoryInfo = () => {
    const out = execSync("head -2 /proc/meminfo |awk -vORS=' ' '{print $2}'")
      .toString()
      .trim()
    const arr = out.split(/\s+/)
    // fixme: string 怎么除 number ？？？？
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const totalMem = (arr[0] / (2 << 9)).toFixed(2)
    // fixme: string 怎么除 number ？？？？
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const freeMem = (arr[1] / (2 << 9)).toFixed(2)
    // fixme: string 怎么除 number ？？？？
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const freePercent = parseFloat(((100 * freeMem) / totalMem).toFixed(2))

    return { totalMem, freeMem, freePercent }
  }

  getDiskInfo = () => {
    const out = execSync('df -h').toString().trim()
    const arr = out.split(/\n|\r\n/)
    arr.pop()

    const RET = []
    for (const line of arr) {
      const diskItem = {}
      const list = line.split(/\s+/)
      if (list.length == 0) continue

      diskItem['fileSystem'] = list[0].trim()
      diskItem['size'] = list[1].trim()
      diskItem['used'] = list[2].trim()
      diskItem['avail'] = list[3].trim()
      diskItem['useRatio'] = list[4].trim()
      diskItem['mountedOn'] = list[5].trim()

      RET.push(diskItem)
    }

    return RET
  }
}
