import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/common/header/header.component';
import { IHeaderButton } from '../../models/common/header-button';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-create-layer-page',
  standalone: true,
  imports: [
    HeaderComponent,
    MapComponent
  ],
  templateUrl: './create-layer-page.component.html',
  styleUrl: './create-layer-page.component.scss'
})
export class CreateLayerPageComponent {
  buttons : IHeaderButton[] = [
    {
      name: 'Главная страница',
      route: '/'
    }
  ]
}
