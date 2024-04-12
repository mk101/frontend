import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IHeaderButton } from '../../../models/common/header-button';
import { AsyncPipe, NgFor } from '@angular/common';
import { HeaderUserComponent } from '../header-user/header-user.component';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/common/user.service';
import { Observable, from } from 'rxjs';
import { User } from '../../../models/common/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, HeaderUserComponent, TuiLinkModule, RouterModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() buttons: IHeaderButton[]

  user$: Observable<User | undefined>

  constructor (private userService: UserService) {}
  
  ngOnInit(): void {
    this.user$ = from(this.userService.getUser())
  }

}
