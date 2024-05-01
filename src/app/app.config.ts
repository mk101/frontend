import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { of } from 'rxjs';

import { routes } from './app.routes';
import { TUI_DIALOG_CLOSES_ON_BACK } from "@taiga-ui/cdk";

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideRouter(routes), importProvidersFrom(TuiRootModule),
    {provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE)},
    {provide: TUI_DIALOG_CLOSES_ON_BACK, useValue: of(true)}
  ]
};
