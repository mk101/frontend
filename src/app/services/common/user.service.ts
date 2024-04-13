import { Injectable } from '@angular/core'
import { User } from '../../models/common/user'
import { Consumer } from '../../models/common/types'
import { LoginRequest, RegisterRequest, TokensResponse } from '../../models/requests/auth'
import { Response } from '../../models/requests/base'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private currentUser: User | undefined

  async login(
    login: string,
    password: string,
    onSuccess: () => void, 
    onError: Consumer<string>
  ): Promise<void> {
    const request: LoginRequest = {
      login: login,
      password: password
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      onError((await response.json())['error'])
      return
    }

    const body = await response.json() as Response<TokensResponse>

    localStorage.setItem('access', body.data!.access)
    localStorage.setItem('refresh', body.data!.refresh)
    onSuccess()
  }

  async logout(
    onSuccess: () => void,
    onError: Consumer<string>
  ) {
    const token = localStorage.getItem('refresh')
    if (token === null) {
      onError('Пользователь не определен')
      return
    }

    const request: TokensResponse = {
      refresh: token,
      access: ''
    }

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      onError((await response.json())['error'])
      return
    }

    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    onSuccess()
  }

  async register(
    request: RegisterRequest,
    onSuccess: () => void,
    onError: Consumer<string>
  ) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      onError((await response.json())['error'])
      return
    }

    onSuccess()
  }

  async getUser(): Promise<User | undefined> {
    if (this.currentUser !== undefined) {
      return this.currentUser
    }

    const token = localStorage.getItem('refresh')
    if (token === null) {
      return undefined
    }

     const payload = JSON.parse(atob(token.split('.')[1]))
     if (payload === null) {
      return undefined
     }

     const sub = payload.sub
     if (sub === undefined) {
      return undefined
     }

     const response = await fetch(`/api/users?id=${sub}`, {
      method: 'GET'
     })

     if (!response.ok) {
      console.log(await response.json())
      return undefined
     }

     return (await response.json())['data']
  }

}
