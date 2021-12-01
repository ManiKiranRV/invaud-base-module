import { Component, OnInit } from '@angular/core';
import { InvoiceStatus } from 'src/app/constants/statusEnum';
import { noSort } from 'src/app/helpers/htmlHelperFunctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  invoiceStage = InvoiceStatus;
  noSort = noSort;
}
