import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { ChargeLineView } from 'core';
import {
  ApiDataParams,
  SearchTypeBool
} from 'src/app/models/agModels';
import { emptyChargeLinesSearchParams } from 'src/app/models/agSearchParams';
import { InvoicesService } from 'src/app/services/invoices.service';
import { chargeLinesColumnDefs } from '../../../../constants/agColumnDefsChargeLines';
import { AggridComponent } from '../../../aggrid/aggrid.component';

@Component({
  selector: 'app-charge-lines-tab',
  templateUrl: './charge-lines-tab.component.html',
})
export class ChargeLinesTabComponent implements OnInit {
  @Input() id: string;
  @ViewChild(AggridComponent) agGridChild: AggridComponent;

  modal: boolean = false;

  activePage: number = 1;
  numberOfRows: number;
  numberPerPage: number = 10;
  numberOfPages: number;

  columnDefs: ColDef[] = chargeLinesColumnDefs;
  emptyChargeLinesSearchParams = {
    ...emptyChargeLinesSearchParams,
    ...({ additionalCharge: false } as SearchTypeBool),
  };
  rowData: ChargeLineView[];
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
    },
  };

  constructor(private invoicesService: InvoicesService) {}

  ngOnInit(): void {
    this.setData({
      newPage: 1,
      searchParams: this.emptyChargeLinesSearchParams,
      sortParams: [],
    });

    this.numberOfPages = Math.ceil(this.numberOfRows / this.numberPerPage);
    this.agGridChild.gridApi.sizeColumnsToFit();
  }

  newPageHandler(newPage: number) {
    this.updataData(newPage);
    this.activePage = newPage;
  }
  onRowDoubleClicked(event: RowDoubleClickedEvent): void {}

  setData(apiDataParams: ApiDataParams): void {
    this.invoicesService
      .getChargeLines(
        this.id,
        apiDataParams.searchParams,
        apiDataParams.sortParams,
        apiDataParams.newPage ?? 1,
      )
      .subscribe((data) => {
        this.rowData = data.data;
        this.numberOfRows = data.numberOfRecords;
        this.activePage = apiDataParams.newPage;
        this.numberOfPages = Math.ceil(this.numberOfRows / this.numberPerPage);
        this.agGridChild.gridApi.sizeColumnsToFit();
      });
  }
  updataData(newPage: number): void {
    this.setData({
      newPage: newPage,
      searchParams: this.agGridChild.searchParams,
      sortParams: this.agGridChild.sortParams,
    });
  }
}
