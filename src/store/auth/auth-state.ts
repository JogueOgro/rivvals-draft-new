import { IAuth } from '@/domain/auth.domain'

export const authInitialState: IAuth = {
  username: '',
  email: '',
  loggedIn: false,
  date: new Date(),
  access_token: '',
}
