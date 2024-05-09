import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../models/common/user';
import { UserService } from '../../../services/common/user.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { TuiAlertService, TuiDataListModule, TuiDropdownModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [NgIf, TuiDropdownModule, TuiAvatarModule, TuiDataListModule, TuiLinkModule, RouterModule, AsyncPipe],
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {

  constructor(
    private router: Router,
    private userService: UserService,
    private alert: TuiAlertService
  ) {}

  @Input()
  user: User | null | undefined

  onClickSettings() {
    location.href = `/users?id=${this.user?.id}`
  }

  onClickExit() {
    this.userService.logout(
      () => window.location.reload(),
      (err) => this.alert.open(err).subscribe()
    )
  }

  get userAvatar(): string | null {
    if (this.user == undefined || this.user == null) {
      return null
    }
    if (this.user.avatar === undefined || this.user.avatar === null) {
      return null
    }

    return `/api/avatars/${this.user.id}`
  }

}
