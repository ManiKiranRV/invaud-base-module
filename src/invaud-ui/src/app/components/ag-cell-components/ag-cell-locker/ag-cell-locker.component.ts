import { Component } from '@angular/core';
// import { Store } from '@ngrx/store';
import { ICellRendererParams } from 'ag-grid-community';
// import { InvoiceOverview, UserResponse } from 'core';

@Component({
  selector: 'app-ag-cell-locker',
  templateUrl: './ag-cell-locker.component.html',
  styleUrls: ['./ag-cell-locker.component.css'],
})
export class AgCellLockerComponent {
  // cellValue: string;
  invoiceIsLocked: boolean;
  // userProfile: UserResponse;
  lockIsDisabled: boolean;

  // constructor(
  //   private store: Store<{ user: UserResponse }>,
  // ) {
  //   store.select('user').subscribe((user: UserResponse) => {
  //     this.userProfile = user;
  //   });
  // }

  agInit(params: ICellRendererParams): void {
    this.invoiceIsLocked = params.data.value;
    // this.setCellValue(params);
  }

  // gets called whenever the cell refreshes
  refresh(params: ICellRendererParams): void {
    // set value into cell again
    this.invoiceIsLocked = params.data;
    // this.setCellValue(params);
  }

  getValueToDisplay(params: ICellRendererParams): any {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  // setCellValue(params: ICellRendererParams): void {
  //   this.cellValue = this.getValueToDisplay(params);
  // }

  onLock(): void {
    console.log('lock clicked');

    // if (this.order.locked) {
    //   this.ordersService
    //     .unlockOrder(
    //       this.order.ecomCode,
    //       this.order.orderNumber,
    //       this.order.invoiceNumber,
    //     )
    //     .subscribe(() => {
    //       this.order.locked = false;
    //       this.order.lockedBy = '';
    //       this.cellValue = this.order.lockedBy;
    //       this.setPageToReadOrWrite();
    //     });
    // } else {
    //   this.ordersService
    //     .lockOrder(
    //       this.order.ecomCode,
    //       this.order.orderNumber,
    //       this.order.invoiceNumber,
    //     )
    //     .subscribe((dto) => {
    //       if (dto.message === 'Order locked') {
    //         this.order.locked = true;
    //         this.order.lockedBy = dto.email;
    //         this.cellValue = this.order.lockedBy;
    //       }
    //       this.setPageToReadOrWrite();
    //     });
    // }
  }
}
