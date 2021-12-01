import { Component, Input } from '@angular/core';
import { AddressView, InvoiceView } from 'core';

@Component({
  selector: 'app-party-details-card',
  templateUrl: './party-details-card.component.html',
})
export class PartyDetailsCardComponent {
  @Input() address: AddressView;
  @Input() title: string;
}
