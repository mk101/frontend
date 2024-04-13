import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TuiAlertService, TuiButtonModule, TuiErrorModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiStepperModule } from '@taiga-ui/kit';
import { UserService } from '../../services/common/user.service';

@Component({
  selector: 'app-register-page',
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
    NgIf
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {

  step: number = 0

  constructor(
    private userService: UserService,
    private alert: TuiAlertService,
    private router: Router
  ) {}

  static checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('passwordValue')!.value;
    let confirmPass = group.get('passwordRepeatValue')!.value
    return pass === confirmPass ? null : { notSame: true }
  }

  registerForm = new FormGroup({
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
    ]),
    firstNameValue: new FormControl('', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(29),
      Validators.pattern('[a-zA-Zа-яА-Я]*')
    ]),
    lastNameValue: new FormControl('', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(29),
      Validators.pattern('[a-zA-Zа-яА-Я]*')
    ]),
  })

  onSubmit(): void {
    this.userService.register({
      first_name: this.registerForm.controls.firstNameValue.value!,
      last_name: this.registerForm.controls.lastNameValue.value!,
      login: this.registerForm.controls.loginValue.value!,
      password: this.registerForm.controls.passwordValue.value!,
      group: 'USER'
    },
    () => {
      this.alert.open('Пользователь зарегистрирован').subscribe()
      this.router.navigate(['/login'])
    },
    (err) => this.alert.open(err).subscribe()
    )
  }
  
}
