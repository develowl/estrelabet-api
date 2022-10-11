export type Jwt = {
  access_token: string
  refresh_token: string
}

export type JwtPayload = {
  identifier: string
}
