import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: '**', pathMatch: 'full', component: NotFoundComponent} // 404
];
