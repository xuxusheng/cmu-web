import dayjs from 'dayjs'
import { generateIcd } from './command/generate/generate-icd'
;(async () => {
  await generateIcd({
    icdFilePath: './public/GW_ZBSH_4httpV3_mod_V5.11.icd',
    excelFilePath: './public/IED_Ld_info5.1-beiyuezhan.xlsx',
    time: dayjs(),
    level: 3
  })
})()
