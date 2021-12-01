import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FilterChangedEvent,
  GridApi,
  GridOptions,
  RowClickedEvent,
  RowDataChangedEvent,
} from 'ag-grid-community';
import { reconciliationColumnDefs } from 'src/app/constants/agColumnDefsReconciliation';
import filterModelEquals from 'src/app/helpers/agFilterModelEquality';
import { ApiDataParams } from 'src/app/models/agModels';
import { emptyReconciliationSearchParams } from 'src/app/models/agSearchParams';
import { FilterModel } from 'src/app/models/FilterModel';
import { ReconciliationService } from 'src/app/services/reconciliation.service';
import { AggridComponent } from '../../aggrid/aggrid.component';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
})
export class ReconciliationComponent implements OnInit {
  // activeTab: keyof typeof InvoiceStatus = InvoiceStatus.All;

  @ViewChild(AggridComponent) agGridChild: AggridComponent;
  rowData: any[]; //TODO: get correct format

  emptySearchparams = emptyReconciliationSearchParams;

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

  columnDefs = reconciliationColumnDefs;

  private gridApi: GridApi = new GridApi();

  constructor(
    private reconciliationService: ReconciliationService, // private router: Router, // private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setData({
      newPage: 1,
      searchParams: emptyReconciliationSearchParams,
      sortParams: [],
    });
  }

  setData(apiDataParams: ApiDataParams): void {
    this.reconciliationService
      .getData(
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

  onRowDoubleClicked(event: RowClickedEvent): void {}

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

  onActiveTabChange(activeTab: any): void {
    // this.activeTab = activeTab;
    // let searchParams = emptyInvoiceSearchparams;
    // if (activeTab === InvoiceStatus.All) {
    //   searchParams.status = {};
    // } else {
    //   searchParams.status.equals = activeTab;
    // }
    // this.setData({
    //   newPage: 1,
    //   searchParams: searchParams,
    //   sortParams: [],
    // });
  }
}
