import { AgCellIconComponent } from '../components/ag-cell-components/ag-cell-icon/ag-cell-icon.component';

export const reconciliationColumnDefs = [
  { headerName: 'Invoice No.', field: 'invoiceNumber' },
  { headerName: 'Level', field: 'level' },
  { headerName: 'Invoice Date', field: 'invoiceDate' },
  { headerName: 'Charge Code', field: 'chargeCode' },
  { headerName: 'Charge Description', field: 'chargeDescription' },
  { headerName: 'Charge Amount', field: 'chargeAmount' },
  {
    headerName: 'Result',
    field: 'result',
    cellRendererFramework: AgCellIconComponent,
  },
  { headerName: 'Actions' },
];
