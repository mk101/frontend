import { Injectable } from '@angular/core';
import { Request, Response } from '../../models/requests/request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private router: Router) { }

  async request(data: Request): Promise<Response> {
    const refresh = localStorage.getItem('refresh')
    let access  = localStorage.getItem('access')
    let headers : HeadersInit | undefined = undefined
    const contentType = data.contentType ?? 'application/json'
    if (data.body !== undefined && contentType !== 'multipart/form-data') {
      headers = {
        ...headers ?? {},
        "Content-Type": contentType
      }
    }

    if (data.useAuth ?? true) {
      if (access === null) {
        access = await this.refreshToken(refresh) ?? null
        if (access === null) {
          localStorage.removeItem('refresh')
          localStorage.removeItem('access')
          this.router.navigate(['/login'])
        } else {
          localStorage.setItem('access', access)
        }
      } else {
        const payload = JSON.parse(atob(access.split('.')[1]))
        const exp = payload.exp as number
        const expDate = new Date(exp * 1000).getUTCMilliseconds()
        if (Date.now() > expDate) {
          access = await this.refreshToken(refresh) ?? null
          if (access === null) {
            localStorage.removeItem('refresh')
            localStorage.removeItem('access')
            this.router.navigate(['/login'])
          } else {
            localStorage.setItem('access', access)
          }
        }
      }

      headers = {
        ...headers,
        Authorization: `Bearer ${access}`
      }
    }

    const response = await fetch(data.url, {
      method: data.method.toString(),
      headers: headers,
      // @ts-ignore
      body: data.body !== undefined 
        ? (contentType === 'application/json' ? JSON.stringify(data.body) : data.body) 
        : undefined,
    })

    if (!response.ok) {
      return {
        code: response.status
      }
    }

    return {
      code: response.status,
      body: await response.json()
    }
  }

  async getAccessToken(): Promise<string | undefined> {
    const refresh = localStorage.getItem('refresh')
    let access  = localStorage.getItem('access')

    if (access === null) {
      access = await this.refreshToken(refresh) ?? null
      if (access === null) {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        this.router.navigate(['/login'])
      } else {
        localStorage.setItem('access', access)
      }
    } else {
      const payload = JSON.parse(atob(access.split('.')[1]))
      const exp = payload.exp as number
      const expDate = new Date(exp * 1000).getUTCMilliseconds()
      if (Date.now() > expDate) {
        access = await this.refreshToken(refresh) ?? null
        if (access === null) {
          localStorage.removeItem('refresh')
          localStorage.removeItem('access')
          this.router.navigate(['/login'])
        } else {
          localStorage.setItem('access', access)
        }
      }
    }

    return access === null ? undefined : access
  }

  private async refreshToken(refresh: string | null): Promise<string | undefined> {
    if (refresh === null) {
      return undefined
    }
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh: refresh
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.status !== 200) {
      return undefined
    }

    return (await response.json())['data']['access']
  }

}
