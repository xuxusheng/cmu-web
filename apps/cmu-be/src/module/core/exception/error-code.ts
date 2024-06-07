export enum ErrCode {
  Success = 0,

  BadRequest = 400_00_000,
  Unauthorized = 401_00_000,
  Forbidden = 403_00_000,
  NotFound = 404_00_000,
  TooManyRequest = 429_00_000,
  InternalServerError = 500_00_000,
  ServiceUnavailable = 503_00_000,

  // Token 相关错误
  TokenEmpty = 401_00_001,
  TokenExpired = 401_00_002,
  TokenInvalid = 401_00_003
}
