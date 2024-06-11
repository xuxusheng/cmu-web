import { Injectable, Logger } from '@nestjs/common'
import { readFileSync, writeFileSync } from 'fs'
import { create } from 'svg-captcha'

@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name)

  constructor() {}

  generateRandomString = (len) => {
    const code = ''
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKMNPQRSTUVWXYZ0123456789'

    const str = Array.from({ length: len })
      .map((n) => chars[Math.floor(Math.random() * chars.length)])
      .join('')

    console.log(str)
    return str
  }

  getFilenamePath(filename) {
    return `/tmp/${filename}.code`
  }

  generateImage = () => {
    const filename = this.generateRandomString(10)
    const captcha = create({ ignoreChars: '10ioOl' })
    const filePath = this.getFilenamePath(filename)
    try {
      writeFileSync(filePath, captcha.text)
    } catch (err) {
      this.logger.warn(`write file ${filePath} failed:`, err)
      return null
    }

    return { file: filename, svg: captcha.data }
  }

  performVerification(code, filename) {
    const filePath = this.getFilenamePath(filename)
    try {
      const rawCode = readFileSync(filePath).toString()
      console.log(rawCode)
      return code.toLowerCase() == rawCode.toLowerCase()
      // fixme: 参数错误，需要两个参数，而且 return 后面怎么还有代码？
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // fs.unlink(filePath)
    } catch (err) {
      this.logger.warn(`open file ${filePath} failed:`, err)
      return false
    }
  }
}
