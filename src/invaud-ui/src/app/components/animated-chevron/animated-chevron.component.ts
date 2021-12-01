import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-chevron',
  templateUrl: './animated-chevron.component.html',
})
export class AnimatedChevronComponent {
  controlBoolean: boolean = false;

  clickedChevronBar(): void {
    this.controlBoolean = !this.controlBoolean;
  }
}
