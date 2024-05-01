import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CreateLayerPageComponent } from './pages/create-layer-page/create-layer-page.component';
import { MyLayersPageComponent } from './pages/my-layers-page/my-layers-page.component';

export const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent},
    {path: 'create-layer', component: CreateLayerPageComponent},
    {path: 'my-layers', component: MyLayersPageComponent},
    {path: '**', pathMatch: 'full', component: NotFoundComponent} // 404
];
