import { Injectable } from '@angular/core';
import { User } from '../../models/common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUser(): User | undefined {
    // return {
    //   first_name: 'Тест',
    //   last_name: 'Тестов',
    //   active: true,
    //   roles: []
    // }

    return undefined
  }

}
