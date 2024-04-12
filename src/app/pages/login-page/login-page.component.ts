import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiStepperModule } from '@taiga-ui/kit';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { of } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TuiStepperModule, ReactiveFormsModule, TuiInputModule, TuiErrorModule, TuiFieldErrorPipeModule, AsyncPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE)}]
})
export class LoginPageComponent {

  loginForm = new FormGroup({
    loginValue: new FormControl('', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(29),
      Validators.pattern('[a-zA-Z0-9_]*')
    ])
  })

}
