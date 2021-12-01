import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.css'],
})
export class CloseButtonComponent {
  @Output() onClick = new EventEmitter();

  onClickHandler(): void {
    this.onClick.emit();
  }
}
