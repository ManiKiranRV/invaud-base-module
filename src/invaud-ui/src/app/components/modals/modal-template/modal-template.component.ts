import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.css'],
})
export class ModalTemplateComponent {
  @Input() dismissable: boolean;
  @Output() closeEvent = new EventEmitter();

  onClick(): void {
    if (this.dismissable) {
      this.closeEvent.emit();
    }
  }
}
