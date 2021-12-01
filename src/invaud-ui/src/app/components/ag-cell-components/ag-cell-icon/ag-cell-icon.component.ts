import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-cell-icon',
  templateUrl: './ag-cell-icon.component.html',
})
export class AgCellIconComponent {
  reconciliationSuccess: boolean;

  agInit(params: ICellRendererParams): void {
    this.reconciliationSuccess = params.value;
  }
}
