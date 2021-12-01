import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FilterChangedEvent,
  GridApi,
  GridOptions,
  RowClickedEvent,
  RowDataChangedEvent,
} from 'ag-grid-community';
import { InvoiceOverview } from 'core';
import { InvoiceStatus } from 'src/app/constants/statusEnum';
import { invoicesAndChargesColumnDefs } from '../../../constants/agColumnDefsInvoicesAndCharges';
import filterModelEquals from '../../../helpers/agFilterModelEquality';
import { ApiDataParams } from '../../../models/agModels';
import { emptyInvoiceSearchparams } from '../../../models/agSearchParams';
import { FilterModel } from '../../../models/FilterModel';
import { InvoicesService } from '../../../services/invoices.service';
import { AggridComponent } from '../../aggrid/aggrid.component';

@Component({
  selector: 'app-invoices-and-charges',
  templateUrl: './invoices-and-charges.component.html',
})
export class InvoicesAndChargesComponent implements OnInit {
  activeTab: keyof typeof InvoiceStatus = InvoiceStatus.All;

  @ViewChild(AggridComponent) agGridChild: AggridComponent;
  rowData: InvoiceOverview[];

  emptySearchparams = emptyInvoiceSearchparams;

  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
      resizable: true,
    },
  };
  allowAPICall: boolean;
  numberOfRows: number;
  numberPerPage: number = 10;
  numberOfPages: number;
  activePage: number = 1;

  private filters: FilterModel | null = null;

  columnDefs = invoicesAndChargesColumnDefs;

  private gridApi: GridApi = new GridApi();

  constructor(
    private invoicesService: InvoicesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setData({
      newPage: 1,
      searchParams: emptyInvoiceSearchparams,
      sortParams: [],
    });
  }

  setData(apiDataParams: ApiDataParams): void {
    this.invoicesService
      .getInvoices(
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
  onRowDataChanged(event: RowDataChangedEvent) {
    // fires when row data is set
    if (this.allowAPICall && this.filters != null) {
      this.allowAPICall = false;
    } else {
      this.gridApi.setFilterModel(this.filters);
    }
  }

  onFilterChanged(event: FilterChangedEvent) {
    // Fires whenever filters are changed

    if (this.allowAPICall) {
      this.filters = this.gridApi.getFilterModel();
    }
    if (this.filters != null) {
      if (
        !this.allowAPICall &&
        filterModelEquals(this.filters, this.gridApi.getFilterModel())
      ) {
        this.allowAPICall = true;
      }
    }
  }

  onRowDoubleClicked(event: RowClickedEvent): void {
    this.router.navigateByUrl(`invoices/${event.data.invoiceNumber}`);
  }

  clearFilters(): void {
    this.agGridChild.clearFilters();
  }

  newPageHandler(newPage: number): void {
    this.updataData(newPage);
    this.activePage = newPage;
  }

  updataData(newPage: number): void {
    this.setData({
      newPage: newPage,
      searchParams: this.agGridChild.searchParams,
      sortParams: this.agGridChild.sortParams,
    });
  }

  onActiveTabChange(activeTab: keyof typeof InvoiceStatus): void {
    this.activeTab = activeTab;
    let searchParams = emptyInvoiceSearchparams;

    if (activeTab === InvoiceStatus.All) {
      searchParams.status = {};
    } else {
      searchParams.status.equals = activeTab;
    }

    this.setData({
      newPage: 1,
      searchParams: searchParams,
      sortParams: [],
    });
  }
}
