import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'
import { of } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
    providers: [
      {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
      {provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE)}
    ]
})
export class AppComponent {
  title = 'frontend-app';
}
