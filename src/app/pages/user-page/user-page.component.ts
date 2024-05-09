import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { IHeaderButton } from '../../models/common/header-button';
import { Role, User } from '../../models/common/user';
import { RequestService } from '../../services/common/request.service';
import { TuiAlertService, TuiButtonModule } from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Method } from '../../models/requests/request';
import { Response } from '../../models/requests/base';
import { CommonModule } from '@angular/common';
import { TuiAvatarModule, TuiFileLike, TuiInputFilesModule, TuiInputModule, TuiInputPasswordModule, TuiTagModule } from '@taiga-ui/kit';
import { SearchData } from '../../models/search';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, from, of, switchMap, timer } from 'rxjs';
import { UserService } from '../../services/common/user.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    TuiAvatarModule,
    TuiTagModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiButtonModule,
    TuiInputFilesModule,
    TuiInputPasswordModule
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  readonly buttons: IHeaderButton[] = [
    {
      name: 'Главная страница',
      route: '/'
    }
  ]

  user: User
  layers: SearchData[] | undefined

  dataForm: FormGroup
  passwordForm: FormGroup = new FormGroup({
    passwordValue: new FormControl('', [
      Validators.required,
      Validators.maxLength(29),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
    ])
  })
  fileControl = new FormControl()

  isCurrentUser: boolean = false
  canBan: boolean = false

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.fileControl.valueChanges.pipe(
      switchMap(file => (file ? this.makeRequest(file) : of(null))),
  );

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private alert: TuiAlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id')
    console.log(id)
    if (id === null || id.trim() === '') {
      this.alert.open('Неверный id пользователя', {status: 'error'}).subscribe()
      this.router.navigate(['/'])
      return
    }

    this.requestService.request({
      method: Method.GET,
      url: `/api/users?id=${id}`,
      useAuth: false
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        this.router.navigate(['/'])
        return
      }

      this.user = (response.body as Response<User>).data!
      
      this.isCurrentUserAsync().then(result => this.isCurrentUser = result)
      this.canBanAsync().then(result => this.canBan = result)

      this.dataForm = new FormGroup({
        firstName: new FormControl(this.user.first_name, [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl(this.user.last_name, [Validators.required, Validators.minLength(2)])
      })

      this.requestService.request({
        method: Method.GET,
        url: `/api/layers/user?id=${this.user.id}`,
        useAuth: false
      }).then(r => {
        if (r.code != 200) {
          this.router.navigate(['/'])
          return
        }

        this.layers = (r.body! as any).data as SearchData[]
      })
    })
  }

  get isAdmin(): boolean {
    return this.user.roles.map(r => r.role).includes(Role.DELETE_ANY_MAP)
  }

  onLayerClick(layer: SearchData) {
    this.router.navigate(['/layer'], {queryParams: {id: layer.id}})
  }

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike)
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file)

    const formData = new FormData()
    formData.append('file', file as File as Blob)
    return from (
        this.requestService.request({
        method: Method.POST,
        url: `/api/avatars/${this.user.id}`,
        body: formData,
        contentType: 'multipart/form-data'
      }).then(response => {
        this.loadingFiles$.next(null)

        if (response.code > 299) {
          this.rejectedFiles$.next(file)
          return null
        }

        this.alert.open('Аватар установлен').subscribe()
        timer(1000).subscribe({
          next: (_) => {
            location.reload()
          }
        })
        return file
      })
    )
  }


  removeFile(): void {
      this.fileControl.setValue(null)
  }

  clearRejected(): void {
      this.removeFile()
      this.rejectedFiles$.next(null)
  }

  get userAvatar(): string | null {
    if (this.user.avatar === undefined || this.user.avatar === null) {
      return null
    }

    return `/api/avatars/${this.user.id}`
  }

  deleteAvatar() {
    this.requestService.request({
      method: Method.DELETE,
      url: `/api/avatars/${this.user.id}`
    }).then(response => {
      if (response.code > 299) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.alert.open('Аватар удален').subscribe()
      timer(1000).subscribe({
        next: (_) => {
          location.reload()
        }
      })
    })
  }

  get nameChanged(): boolean {
    return this.dataForm.valid && this.dataForm.controls.firstName.value !== this.user.first_name ||
           this.dataForm.controls.lastName.value !== this.user.last_name
  }

  get isDisabled(): boolean {
    return !this.user.active
  }

  updateName() {
    this.requestService.request({
      method: Method.PUT,
      url: '/api/users',
      body: {
        ...this.user,
        first_name: this.dataForm.controls.firstName.value,
        last_name: this.dataForm.controls.lastName.value
      }
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.alert.open('Успешно').subscribe()
      timer(1000).subscribe({
        next: (_) => {
          location.reload()
        }
      })
    })
  }

  async isCurrentUserAsync(): Promise<boolean> {
    const current = await this.userService.getUser()
    if (current === undefined) {
      return false
    }
    return current.id === this.user.id
  }

  updatePassword() {
    this.requestService.request({
      method: Method.POST,
      url: '/api/users/reset',
      body: {
        id: this.user.id,
        password: this.passwordForm.controls.passwordValue.value
      }
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.alert.open('Успех').subscribe()
    })
  }

  ban() {
    this.requestService.request({
      method: Method.PUT,
      url: '/api/users',
      body: {
        ...this.user,
        active: false
      }
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.alert.open('Успешно').subscribe()
      timer(1000).subscribe({
        next: (_) => {
          location.reload()
        }
      })
    })
  }

  async canBanAsync(): Promise<boolean> {
    const current = await this.userService.getUser()
    if (current === undefined) {
      return false
    }

    return current.id !== this.user.id && !this.isAdmin && current.roles.map(r => r.role).includes(Role.EDIT_USERS)
  }

  unban() {
    this.requestService.request({
      method: Method.PUT,
      url: '/api/users',
      body: {
        ...this.user,
        active: true
      }
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.alert.open('Успешно').subscribe()
      timer(1000).subscribe({
        next: (_) => {
          location.reload()
        }
      })
    })
  }

}
