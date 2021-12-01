import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  RowDoubleClickedEvent,
} from 'ag-grid-community';
import { UserResponse } from 'core';
import { usersColumnDefs } from 'src/app/constants/agColumnDefsUsers';
import { emptyUsersSearchparams } from 'src/app/models/agSearchParams';
import { UsersService } from 'src/app/services/users.service';
import { ApiDataParams } from 'src/app/models/agModels';
import { AggridComponent } from 'src/app/components/aggrid/aggrid.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  @ViewChild(AggridComponent) agGridChild: AggridComponent;

  columnDefs: ColDef[] = usersColumnDefs;
  modal = false;
  modalType = null;
  editUser: UserResponse;
  rowData: UserResponse[];
  emptyUsersSearchparams = emptyUsersSearchparams;
  userProfile: UserResponse | null;

  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
      resizable: true,
    },
  };

  gridApi: GridApi = new GridApi();
  columnApi: ColumnApi = new ColumnApi();

  numberOfRows: number;
  numberPerPage = 10; // This is currently coincidental. If we want smaller we need to change BE
  numberOfPages: number;
  activePage = 1;

  constructor(
    private usersService: UsersService,
    private store: Store<{ user: UserResponse }>,
  ) {}

  ngOnInit(): void {
    this.setData({
      newPage: 1,
      searchParams: emptyUsersSearchparams,
      sortParams: [],
    });

    this.store.select('user').subscribe((user: UserResponse) => {
      this.userProfile = user;
    });
  }

  openModal(type: string): void {
    this.modal = true;
    this.modalType = type;
  }

  closeModal(): void {
    this.modal = false;
  }

  setData(apiDataParams: ApiDataParams): void {
    this.usersService
      .getUsers(
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

  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    if (this.userProfile.role !== 'super_admin') {
      this.editUser = event.data;
      this.openModal('edit');
    }
  }

  clearFilters(): void {
    this.agGridChild.clearFilters();
  }

  newPageHandler(newPage: number): void {
    this.updataData(newPage);
    this.activePage = newPage;
  }

  dataChangedFromModalHandler(): void {
    this.updataData(1);
  }

  updataData(newPage: number): void {
    this.setData({
      newPage: newPage,
      searchParams: this.agGridChild.searchParams,
      sortParams: this.agGridChild.sortParams,
    });
  }
}
