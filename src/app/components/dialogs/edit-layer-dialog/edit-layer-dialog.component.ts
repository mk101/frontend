import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiDialogContext, TuiDialogModule, TuiDialogService, TuiRootModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import { EditLayer } from '../../../models/edit-layer';

@Component({
  selector: 'app-edit-layer-dialog',
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
  templateUrl: './edit-layer-dialog.component.html',
  styleUrl: './edit-layer-dialog.component.scss'
})
export class EditLayerDialogComponent {
  name = this.context.data.name
  desc = this.context.data.description
  tags = this.context.data.tags.join(' ')
  status = this.getLocaleStatus(this.context.data.status)

  readonly statuses = [
    'Инфо', 'Проблема', 'Решено'
  ]

  constructor(
    private dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<EditLayer, EditLayer>
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
           this.tags != ''
  }

  private getStatus(str: string): 'INFO' | 'WARNING' | 'RESOLVE' {
    if (str === 'Инфо') {
      return 'INFO'
    } else if (str === 'Решено') {
      return 'RESOLVE'
    }

    return 'WARNING'
  }

  private getLocaleStatus(str: 'INFO' | 'WARNING' | 'RESOLVE'): 'Инфо' | 'Проблема' | 'Решено' {
    if (str === 'INFO') {
      return 'Инфо'
    } else if (str === 'RESOLVE') {
      return 'Решено'
    }

    return 'Проблема'
  }

}
