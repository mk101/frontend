import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IHeaderButton } from '../../../models/common/header-button';
import { NgFor } from '@angular/common';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, HeaderUserComponent, TuiLinkModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() buttons: IHeaderButton[]
}
