import { Component, Input } from '@angular/core';
import { InvoiceView, StationType, StationView } from 'core';

@Component({
  selector: 'app-proforma-details-tab',
  templateUrl: './proforma-details-tab.component.html',
  styleUrls: ['./proforma-details-tab.component.css'],
})
export class ProformaDetailsTabComponent {
  @Input() invoice: InvoiceView;

  findStation(stationType: StationType): StationView {    
    return this.invoice?.shipment?.stations.find((station) => {
      return station.type === stationType;
    });
  }
}
