import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiErrorModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiStepperModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    TuiStepperModule, 
    ReactiveFormsModule, 
    RouterModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiErrorModule, 
    TuiFieldErrorPipeModule,
    TuiButtonModule, 
    TuiLinkModule,
    AsyncPipe,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  loginForm = new FormGroup({
    loginValue: new FormControl('', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(29),
      Validators.pattern('[a-zA-Z0-9_]*')
    ]),
    passwordValue: new FormControl('', [
      Validators.required,
      Validators.maxLength(29),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
    ])
  })

  onSubmit(): void {
    console.log('hi')
  }

}
