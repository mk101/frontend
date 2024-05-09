import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[middleclick]',
  standalone: true
})
export class MiddleclickDirective {

  @Output('middleclick') middleclick = new EventEmitter()

  constructor() { }

  @HostListener('mouseup', ['$event'])
  middleclickEvent(event: any) {
    if (event.button === 1) {
      this.middleclick.emit(event)
    }
  }

}
