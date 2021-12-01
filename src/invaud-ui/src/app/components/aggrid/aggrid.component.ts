import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDoubleClickedEvent,
} from 'ag-grid-community';
import { filterBuilder } from 'src/app/helpers/AgFilterBuilder';
import { cloneObject } from 'src/app/helpers/cloneObject';
import { isEqual } from 'src/app/helpers/isEqual';
import { FilterModel } from 'src/app/models/agFilterModels';
import { ApiDataParams, SearchParams } from 'src/app/models/agModels';
import { SortParams } from 'src/app/models/agSearchParams';

@Component({
  selector: 'app-aggrid',
  templateUrl: './aggrid.component.html',
})
export class AggridComponent implements AfterViewInit {
  @Input() rowData: any[];
  @Input() columnDefs: ColDef[];
  @Input() gridOptions: GridOptions;
  @Input() emptySearchParams: SearchParams;
  @Output() onSetData: EventEmitter<ApiDataParams> = new EventEmitter();
  @Output() onRowDoubleClickedEvent = new EventEmitter<RowDoubleClickedEvent>();

  gridApi: GridApi = new GridApi();
  columnApi: ColumnApi = new ColumnApi();

  cachedFilters: FilterModel | null = null;
  searchParams: SearchParams;
  preventingRenderLoop = false;
  sortParams: SortParams = [];

  ngAfterViewInit(): void {
    this.searchParams = this.emptySearchParams;
  }

  setEmptyFilterSearchParams(): void {
    this.searchParams = cloneObject(this.emptySearchParams);
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    this.onRowDoubleClickedEvent.emit(event);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    // this.columnApi.autoSizeAllColumns();
    this.gridApi.sizeColumnsToFit();
  }

  onRowDataChanged(): void {
    this.setCachedFiltersInUi();
  }

  setData(data: ApiDataParams) {
    this.onSetData.emit(data);
  }

  dataParams(): ApiDataParams {
    return {
      newPage: 1,
      searchParams: this.searchParams,
      sortParams: this.sortParams,
    };
  }

  /*** Sort Section ***/

  onSortChanged(): void {
    this.sortBuilder();
    this.setData(this.dataParams());
  }

  sortBuilder(): void {
    this.sortParams = [];
    this.columnApi.getColumnState().map((col) => {
      this.sortParams.push({ [col.colId]: col.sort });
    });
    this.removeNullSorts();
  }

  removeNullSorts(): void {
    this.sortParams = this.sortParams.filter(
      (param) => !Object.values(param).includes(null),
    );
  }

  /*** Filter section  ***/
  onFilterChanged(): void {
    if (!this.preventingRenderLoop) {
      this.cachedFilters = this.gridApi.getFilterModel();
      this.setEmptyFilterSearchParams();
      filterBuilder(this.searchParams, this.gridApi.getFilterModel());
      this.setData(this.dataParams());
    }
    this.checkIfFilterChangesHaveFinished();
  }

  checkIfFilterChangesHaveFinished(): void {
    if (this.cachedFilters) {
      if (this.checkIfUIFilterMatchesCache()) {
        this.allowNextFilterChangeToCallApi();
      }
    }
  }

  checkIfUIFilterMatchesCache(): boolean {
    return (
      this.preventingRenderLoop &&
      isEqual(this.cachedFilters, this.gridApi.getFilterModel())
    );
  }

  allowNextFilterChangeToCallApi(): void {
    this.preventingRenderLoop = false;
  }

  setCachedFiltersInUi(): void {
    if (this.settingFiltersInUiWillCauseALoop()) {
      this.preventingRenderLoop = true;
    }

    if (this.gridApi) this.gridApi.setFilterModel(this.cachedFilters);
  }

  settingFiltersInUiWillCauseALoop(): boolean {
    return !this.preventingRenderLoop && !!this.cachedFilters;
  }

  clearFilters(): void {
    this.sortParams = [];
    this.cachedFilters = null;
    this.setEmptyFilterSearchParams();
    this.setData(this.dataParams());
    this.columnApi.resetColumnState();
  }
}
