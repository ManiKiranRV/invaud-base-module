import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressView, InvoiceView } from 'core';
import { InvoiceStatus } from 'src/app/constants/statusEnum';
import { InvoicesService } from '../../../services/invoices.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css'],
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: InvoiceView;
  invoiceStage = InvoiceStatus;
  billToPartyAddress: AddressView;
  consigneeAddress: AddressView;
  shipperAddress: AddressView;
  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('invoiceNumber');

    this.invoicesService.getInvoiceDetails(id).subscribe((invoice) => {
      this.invoice = invoice;
      this.billToPartyAddress = invoice.billToPartyAddress;
      this.consigneeAddress = invoice.consigneeAddress;
      this.shipperAddress = invoice.shipperAddress;
    });

    
  }
}
