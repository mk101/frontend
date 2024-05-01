import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiContextWithImplicit, TuiStringHandler, tuiPure } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiHintModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { DrawType } from '../../models/draw';

@Component({
  selector: 'app-map-draw',
  standalone: true,
  imports: [
    TuiSelectModule, 
    TuiButtonModule,
    TuiDataListWrapperModule, 
    TuiHintModule,
    ReactiveFormsModule
  ],
  templateUrl: './map-draw.component.html',
  styleUrl: './map-draw.component.scss'
})
export class MapDrawComponent {
  @Output() onTypeChange: EventEmitter<DrawType | undefined> = new EventEmitter()
  @Output() onUndo: EventEmitter<void> = new EventEmitter()
  @Output() onClear: EventEmitter<void> = new EventEmitter()
  @Output() onSave: EventEmitter<void> = new EventEmitter()

  drawForm = new FormGroup({
    typeValue: new FormControl()
  })

  types: DrawType[] = [
    new DrawType('Polygon', 'Полигон'),
    new DrawType('Circle', 'Круг')
  ]

  typesString = this.types.map(t => t.toString())

  onUndoClick() {
    this.onUndo.emit()
  }

  onClearClick() {
    this.onClear.emit()
  }

  onItemClick(item: string) {
    const obj = this.types.filter(t => t.name === item).at(0)
    this.onTypeChange.emit(obj)
  }

  onSaveClick() {
    this.onSave.emit()
  }

}
