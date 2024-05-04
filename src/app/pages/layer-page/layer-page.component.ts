import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/common/request.service';
import { Method } from '../../models/requests/request';
import { TuiAlertService, TuiButtonModule, TuiDialogService, TuiSvgModule } from '@taiga-ui/core';
import { SearchData } from '../../models/search';
import { Response } from '../../models/requests/base';
import { HeaderComponent } from '../../components/common/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { IHeaderButton } from '../../models/common/header-button';
import { CommonModule } from '@angular/common';
import { TuiTagModule } from '@taiga-ui/kit';
import { User, Role } from '../../models/common/user';
import { UserService } from '../../services/common/user.service';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import { EditLayerDialogComponent } from '../../components/dialogs/edit-layer-dialog/edit-layer-dialog.component';
import { EditLayer } from '../../models/edit-layer';

@Component({
  selector: 'app-layer-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MapComponent,
    TuiTagModule,
    TuiSvgModule,
    TuiButtonModule
  ],
  templateUrl: './layer-page.component.html',
  styleUrl: './layer-page.component.scss'
})
export class LayerPageComponent implements OnInit {

  private id: string
  layer: SearchData
  createdUser: User
  modifyUser: User | undefined

  canEdit = false
  canDelete = false

  readonly buttons: IHeaderButton[] = [
    {
      name: 'Главная страница',
      route: '/'
    }
  ]

  readonly iconMap = {
    'WARNING': 'tuiIconZapLarge',
    'RESOLVE': 'tuiIconCheckLarge',
    'INFO': 'tuiIconInfoLarge'
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private alert: TuiAlertService,
    private userService: UserService,
    private readonly dialogs: TuiDialogService,
    private readonly injector: Injector
  ) {}

  ngOnInit(): void {
    this.loadLayer()
  }

  loadLayer(): void {
    const tmp = this.route.snapshot.queryParamMap.get('id')
    if (tmp === null || tmp.trim() === '') {
      this.router.navigate(['/'])
      return
    }

    this.id = tmp.trim()
    this.requestService.request({
      method: Method.GET,
      url: `/api/layers?id=${this.id}`,
      useAuth: false
    }).then(response => {
      if (response.code !== 200) {
        if (response.code === 404) {
          this.alert.open('Слой не найден', {status: 'warning'}).subscribe()
        }

        this.router.navigate(['/'])
        return
      }

      this.layer = (response.body as Response<SearchData>).data!
      this.getUser(this.layer.createdBy).then(usr => {
        if (usr === undefined) {
          this.alert.open('Ошибка при получении пользователя!', {status: 'error'}).subscribe()
          this.router.navigate(['/'])
          return
        }

        this.createdUser = usr
      })
      this.getUser(this.layer.editBy).then(usr => this.modifyUser = usr)

      this.hasRightsToEditAsync().then(r => this.canEdit = r)
      this.hasRightsToDeleteAsync().then(r => this.canDelete = r)
    })
  }

  private async hasRightsToDeleteAsync(): Promise<boolean> {
    const user = await this.userService.getUser()

    if (user === undefined) {
      return false
    }

    if (user.roles.map(r => r.role).includes(Role.DELETE_ANY_MAP)) {
      return true
    }

    return user.roles.map(r => r.role).includes(Role.DELETE_OWN_MAP)
  }

  private async hasRightsToEditAsync(): Promise<boolean> {
    const user = await this.userService.getUser()

    if (user === undefined) {
      return false
    }

    if (user.roles.map(r => r.role).includes(Role.EDIT_ANY_MAP)) {
      return true
    }

    return user.roles.map(r => r.role).includes(Role.EDIT_OWN_MAP)
  }

  private async getUser(id: string | undefined): Promise<User | undefined> {
    if (id === undefined || id === null) {
      return undefined
    }

    const response = await this.requestService.request({
      method: Method.GET,
      url: `/api/users?id=${id}`,
      useAuth: false
    })

    if (response.code !== 200) {
      return undefined
    }

    return (response.body as Response<User>).data!
  }

  onEdit() {
    this.dialogs.open<EditLayer>(
        new PolymorpheusComponent(EditLayerDialogComponent, this.injector),
        {
            data: <EditLayer>{
              name: this.layer.name,
              description: this.layer.description,
              status: this.layer.status,
              tags: this.layer.tags
            },
            dismissible: true,
            label: 'Изменить слой',
        },
    ).subscribe({
      next: value => {
        this.requestService.request({
          method: Method.PUT,
          url: '/api/layers',
          body: {
            ...value,
            id: this.layer.id,
            data: this.layer.data
          }
        }).then(response => {
          if (response.code !== 200) {
            this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
            console.log(response)
            return
          }

          this.alert.open('Успешно').subscribe()
          this.loadLayer()
        })
      }
    })
  }

  onDelete() {
    this.requestService.request({
      method: Method.DELETE,
      url: `/api/layers?id=${this.layer.id}`
    }).then(response => {
      if (response.code !== 200) {
        this.alert.open('Что-то пошло не так', {status: 'error'}).subscribe()
        return
      }

      this.router.navigate(['my-layers'])
    })
  }

}
