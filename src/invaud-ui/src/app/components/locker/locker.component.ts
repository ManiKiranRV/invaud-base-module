import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
})
export class LockerComponent {
  @Input('locked') locked: boolean;
  @Input('disabled') disabled: boolean;
  @Output() onLockEvent: EventEmitter<null> = new EventEmitter();

  onLock(): void {
    this.onLockEvent.emit();
  }
}
