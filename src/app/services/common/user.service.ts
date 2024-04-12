import { Injectable } from '@angular/core'
import { User } from '../../models/common/user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private currentUser: User | undefined

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
