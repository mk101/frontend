import { Component, Inject } from '@angular/core';
import { TuiButtonModule, TuiDataListModule, TuiDialogContext, TuiDialogModule, TuiDialogService, TuiRootModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import { SaveLayer } from '../../../models/draw';
import { TuiDataListWrapperModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';

@Component({
  selector: 'app-save-layer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiInputModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    TuiRootModule,
    TuiDialogModule
  ],
  templateUrl: './save-layer-dialog.component.html',
  styleUrls: [
    './save-layer-dialog.component.scss'
  ]
})
export class SaveLayerDialogComponent {
  name = ''
  desc = ''
  tags = ''
  status = ''

  readonly statuses = [
    'Инфо', 'Проблема'
  ]

  constructor(
    private dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<SaveLayer, SaveLayer>
  ) {}

  submit() {
    this.context.completeWith({
      name: this.name,
      description: this.desc,
      status: this.getStatus(this.status),
      tags: this.tags.trim().split(' ')
    })
  }

  get hasValue(): boolean {
    return this.name != '' &&
           this.desc != '' &&
           this.tags != '' &&
           this.status != ''
  }

  private getStatus(str: string): 'INFO' | 'WARNING' {
    if (str === 'Инфо') {
      return 'INFO'
    }

    return 'WARNING'
  }

}
