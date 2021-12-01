import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { ReferenceView } from 'core';
import { ApiDataParams } from 'src/app/models/agModels';
import { emptyReferencesSearchParams } from 'src/app/models/agSearchParams';
import { referencesColumnDefs } from '../../../../constants/agColumnDefsReferencs';
import { AggridComponent } from '../../../aggrid/aggrid.component';

@Component({
  selector: 'app-references-tab',
  templateUrl: './references-tab.component.html',
})
export class ReferencesTabComponent implements OnInit {
  @Input() references: ReferenceView[];
  @Input() id: string;

  @ViewChild(AggridComponent) agGridChild: AggridComponent;

  numberOfRows: number;
  numberPerPage: number = 10;
  numberOfPages: number;
  activePage: number = 1;

  columnDefs: ColDef[] = referencesColumnDefs;
  emptyReferencesSearchParams = emptyReferencesSearchParams;

  rowData: ReferenceView[];
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      sortable: true,
    },
  };

  // constructor(private referencesService: ReferencesService) {}

  ngOnInit(): void {
    this.rowData = this.references;
    this.numberOfRows = this.references.length;
    this.numberOfPages = Math.ceil(this.numberOfRows / this.numberPerPage);
    this.agGridChild.gridApi.sizeColumnsToFit();
  }

  newPageHandler(newPage: number) {
    this.updataData(newPage);
    this.activePage = newPage;
  }
  onRowDoubleClicked(event: RowDoubleClickedEvent): void {}

  setData(apiDataParams: ApiDataParams): void {}

  updataData(newPage: number): void {
    this.setData({
      newPage: newPage,
      searchParams: this.agGridChild.searchParams,
      sortParams: this.agGridChild.sortParams,
    });
  }
}
