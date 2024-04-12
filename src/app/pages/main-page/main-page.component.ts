import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { IHeaderButton } from '../../models/common/header-button';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderComponent, MapComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  buttons: IHeaderButton[] = [
    {
      name: 'Создать слой',
      route: '/create-layer'
    }
  ]
}
