import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../../models/common/user';
import { UserService } from '../../../services/common/user.service';
import { NgIf } from '@angular/common';
import { TuiDataListModule, TuiDropdownModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [NgIf, TuiDropdownModule, TuiAvatarModule, TuiDataListModule, TuiLinkModule, RouterModule],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent implements OnInit {

  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  user?: User

  ngOnInit(): void {
    this.user = this.userService.getUser()
  }

  onClickSettings() {
    this.router.navigate(['/settings'])
  }

  onClickExit() {
    console.log('Exit')
  }

}
