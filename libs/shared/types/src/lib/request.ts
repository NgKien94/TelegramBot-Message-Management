// AUTH

export type LoginRequest = {
  email: string
  password: string
}

// export type RegisterRequest = {
//   email: string
//   username: string
//   password: string
// }

export type LogoutRequest = {
  token: string // refresh_token
}

export type RefreshTokenRequest = {
  token: string // refresh_token
}
