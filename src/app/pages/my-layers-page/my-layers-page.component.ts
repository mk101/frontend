import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { IHeaderButton } from '../../models/common/header-button';
import { RequestService } from '../../services/common/request.service';
import { Method } from '../../models/requests/request';
import { UserService } from '../../services/common/user.service';
import { Router } from '@angular/router';
import { SearchData } from '../../models/search';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-layers-page',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './my-layers-page.component.html',
  styleUrl: './my-layers-page.component.scss'
})
export class MyLayersPageComponent implements OnInit {

  readonly buttons: IHeaderButton[] = [
    {
      name: 'Главная страница',
      route: '/'
    }
  ]

  layers: SearchData[] | undefined

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUser().then(usr => {
      if (usr === undefined || usr.id == undefined) {
        this.router.navigate(['/'])
        return
      }

      this.requestService.request({
        method: Method.GET,
        url: `/api/layers?id=${usr.id}`
      }).then(r => {
        if (r.code != 200) {
          this.router.navigate(['/'])
          return
        }

        this.layers = (r.body! as any).data as SearchData[]
      })
    })
  }

  onClick(layer: SearchData) {
    this.router.navigateByUrl(`/layer?id=${layer.id}`)
  }

}
