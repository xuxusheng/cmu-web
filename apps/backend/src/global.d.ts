import 'express'
import { UserInfoTblEntity } from './module/shared/model/entity/cfg/user-info-tbl.entity'

declare module 'express' {
  interface Request {
    user?: UserInfoTblEntity
  }
}

// Setup a one time declaration to make knex use number as result type for all
// count and countDistinct invocations (for any table)
declare module 'knex/types/result' {
  interface Registry {
    Count: number
  }
}
