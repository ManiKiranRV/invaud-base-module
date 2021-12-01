import { Component, Input } from '@angular/core';
import { StationView } from 'core';

@Component({
  selector: 'app-location-row',
  templateUrl: './location-row.component.html',
})
export class LocationRowComponent {
  @Input() location: StationView;
}
