export type AuthUser = {
  id: string
  email: string
  name: string
  homeLocation?: string
  isVip?: boolean
  groupId?: string
  emailVerified?: boolean
}

export type LoginResponse = {
  success: true
  message?: string
  data: { token: string; user: AuthUser }
}

export type MeResponse = {
  success: true
  data: { user: AuthUser }
}
