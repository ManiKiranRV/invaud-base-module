import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import {
  ChargeLineView,
  CreateOrUpdateChargeLineView,
  UserResponse,
} from 'core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AgButtonComponent } from 'src/app/components/ag-cell-components/ag-button/ag-button.component';
import { AggridComponent } from 'src/app/components/aggrid/aggrid.component';
import { additionalChargesColumnDefs } from 'src/app/constants/agColumnDefsChargeLines';
import { ApiDataParams, SearchTypeBool } from 'src/app/models/agModels';
import { emptyChargeLinesSearchParams } from 'src/app/models/agSearchParams';
import { InvoicesService } from 'src/app/services/invoices.service';

@Component({
  selector: 'app-additional-charges-tab',
  templateUrl: './additional-charges-tab.component.html',
})
export class AdditionalChargesTabComponent implements OnInit {
  @Input() id: string;
  @ViewChild(AggridComponent) agGridChild: AggridComponent;
  rowClicked: number | null;
  user: UserResponse;
  modalType: string;
  editValue: ChargeLineView;

  modal: boolean = false;

  activePage: number = 1;
  numberOfRows: number;
  numberPerPage: number = 10;
  numberOfPages: number;

  columnDefs: ColDef[] = additionalChargesColumnDefs.concat([
    {
      headerName: 'Actions',
      field: '',
      filter: false,
      sortable: false,
      cellRendererFramework: AgButtonComponent,
      cellRendererParams: {
        clicked: (rowClicked: number, buttonClicked: string) => {
          this.rowClicked = rowClicked;
          this.handleAdditionalChargeAction(buttonClicked);
        },
      },
    },
  ]);
  emptyChargeLinesSearchParams = {
    ...emptyChargeLinesSearchParams,
    ...({ additionalCharge: true } as SearchTypeBool),
  };

  rowData: ChargeLineView[];
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
    },
  };

  constructor(
    private invoicesService: InvoicesService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUserFromStore();
  }

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

  openModal(type: string): void {
    this.modal = true;
    this.modalType = type;
  }

  closeModal(): void {
    this.modal = false;
  }

  onSubmit(submitEvent: {
    chargeLine: CreateOrUpdateChargeLineView;
    type: string;
  }) {
    if (submitEvent.type === 'add') {
      this.invoicesService
        .newChargeLine(this.id, submitEvent.chargeLine)
        .subscribe((res) => {
          this.setData({
            newPage: this.activePage,
            searchParams: this.agGridChild.searchParams,
            sortParams: this.agGridChild.sortParams,
          });
        });
    } else if (submitEvent.type === 'edit') {
      this.invoicesService
        .editChargeLine(this.editValue.id, submitEvent.chargeLine)
        .subscribe((res) => {
          this.setData({
            newPage: this.activePage,
            searchParams: this.agGridChild.searchParams,
            sortParams: this.agGridChild.sortParams,
          });
        });
    }
  }

  acceptCharge(id: string) {
    this.invoicesService.approveAdditionalCharge(id).subscribe((val) => {
      this.setData({
        newPage: this.activePage,
        searchParams: this.agGridChild.searchParams,
        sortParams: this.agGridChild.sortParams,
      });
    });
  }

  rejectCharge(id: string) {
    this.invoicesService.rejectAdditionalCharge(id).subscribe((val) => {
      this.setData({
        newPage: this.activePage,
        searchParams: this.agGridChild.searchParams,
        sortParams: this.agGridChild.sortParams,
      });
    });
  }

  handleAdditionalChargeAction(buttonClicked: string): void {
    if (this.rowClicked !== null) {
      const data = this.rowData[this.rowClicked];
      if (buttonClicked === 'approve') {
        this.acceptCharge(data.id);
      } else if (buttonClicked === 'reject') {
        this.rejectCharge(data.id);
      } else if (buttonClicked === 'edit') {
        this.editValue = data;
        this.openModal('edit');
      } else {
        console.log('Something went wrong');
      }
    }
  }
}
