import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

import { Result } from '../../shared/model/result'
import { AuthenticateService } from '../service/authenticate.service'
import { DoAttrService } from '../service/do-attr.service'
import { FileService } from '../service/file.service'
import { SysService } from '../service/sys.service'
import { VerifyService } from '../service/verify.service'
import { XmlService } from '../service/xml.service'

@Controller('api')
export class IndexController {
  private readonly logger = new Logger(IndexController.name)

  constructor(
    private verifySvc: VerifyService,
    private sysSvc: SysService,
    private authSvc: AuthenticateService,
    private doAttrSvc: DoAttrService,
    private xmlSvc: XmlService,
    private fileSvc: FileService
  ) {}

  @Get()
  index() {
    return 'respond with a resource'
  }

  @Get('verify_code')
  verifyCode() {
    return this.verifySvc.generateImage()
  }

  @Get('net_set')
  async getNetSet() {
    const data = await this.sysSvc.getNetParam()
    return Result.ok(data as any)
  }

  @Post('net_set')
  async setNetSet(@Body() body) {
    this.sysSvc.setNetParam(body)
  }

  @Post('login')
  async login(@Body() body) {
    console.log(body)
    const isCodeRight = this.verifySvc.performVerification(
      body?.verifyCode,
      body?.file
    )

    this.logger.log(`verify code ${body?.verifyCode} return `, isCodeRight)
    if (!isCodeRight) throw new Error('验证码异常！')

    const user = await this.authSvc.checkLogin(body)
    console.log('req: ', body)
    console.log('o:', user)
    if (user && user.password == body.passwd) {
      const jwtToken = this.authSvc.makeToken(user.userName, user.userLevel)
      return { token: jwtToken }
    } else {
      throw new Error('用户名密码错误！')
    }
  }

  @Get('map_params')
  async getMapParams() {
    return this.doAttrSvc.getMapParams()
  }

  @Get('commu_proc_attrs')
  async getCommuProcAttrs() {
    return this.doAttrSvc.getCommuProcAttrs()
  }

  @Post('commu_proc_attrs')
  async updateCommuProcAttrs(@Body() body) {
    return this.doAttrSvc.updateCommuProcAttrs(body)
  }

  @Get('log_cfg')
  async getLogCfg() {
    return this.xmlSvc.getLogConfigData()
  }

  @Post('log_cfg')
  async setLogCfg(@Body() body) {
    return this.xmlSvc.writeLogConfigData(body)
  }

  @Get('mms_cfg')
  async getMmsCfg() {
    return this.xmlSvc.getMMSConfigData()
  }

  @Post('mms_cfg')
  async setMmsCfg(@Body() body) {
    return this.xmlSvc.writeMMSConfigData(body)
  }

  @Get('ntp_cfg')
  async getNtpCfg() {
    return this.xmlSvc.getNTPConfigData()
  }

  @Post('ntp_cfg')
  async setNtpCfg(@Body() body) {
    return this.xmlSvc.writeNTPConfigData(body)
  }

  @Get('cfg_filelist')
  async getCfgFileList() {
    return this.fileSvc.getCmuFileList()
  }

  @Get('tools_filelist')
  async getToolsFileList() {
    return this.fileSvc.getToolsFileList()
  }

  @Get('file_download')
  async fileDownload(@Query() query, @Res() res: Response) {
    const { type, filename } = query
    if (!type || !filename) {
      throw new Error(' need arg `type` and `filename`')
    }

    const o = this.fileSvc.getFile(type, filename)
    if (o === null) throw new Error('invalid argument!')

    // todo 能否生效需要验证一下
    res.download(`${o.dir}/${o.filename}`, o.filename)
  }

  @Post('icd_upload')
  @UseInterceptors(FileInterceptor('newfile'))
  async icdUpload(@UploadedFile() file: Express.Multer.File) {
    return this.fileSvc.onUploadFile({
      newfile: file
    })
  }

  @Get('config_export')
  async configExport(@Res() res: Response) {
    // todo 验证下功能是否正常
    const filePath = this.fileSvc.getConfigTarFile()
    res.download(filePath)
  }

  @Get('ied_license')
  async getIedLicense() {
    return Result.ok(this.sysSvc.getHashString())
  }

  @Get('proc_status')
  async getProcStatus() {
    const data = this.sysSvc.getProcStatus()
    return Result.ok(data as any)
  }

  @Post('ied_reset')
  async iedReset() {
    this.sysSvc.reboot()
  }

  @Post('/proc_status/restart/:procName')
  async restartProc(@Param('procName') procName: string) {
    this.sysSvc.restartProc(procName)
  }

  // fixme: 两个一模一样的路由，用哪个？？？
  // @Get('config_export')
  // async configExport(@Body() body) {
  //   this.sysSvc.setHashString(body)
  // }
}
