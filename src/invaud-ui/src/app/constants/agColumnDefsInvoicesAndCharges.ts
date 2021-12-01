import { AgCellLockerComponent } from '../components/ag-cell-components/ag-cell-locker/ag-cell-locker.component';

export const invoicesAndChargesColumnDefs = [
  {
    field: 'locked',
    headerName: 'Lock',
    cellRendererFramework: AgCellLockerComponent,
  },
  { field: 'originCode', headerName: 'Origin' },
  { field: 'destinationCode', headerName: 'Destination' },
  { field: 'shipmentDate', filter: 'agDateColumnFilter' },
  { field: 'invoiceNumber', headerName: 'Invoice No.' },
  // { field: 'type', headerName: 'Type' },
  {
    field: 'invoiceDate',
    filter: 'agDateColumnFilter',
  },
  { field: 'billToParty' },
  { field: 'shipper' },
  { field: 'consignee' },
  { field: 'totalValueOfGoods', filter: 'agNumberColumnFilter' },
  { field: 'status', filter: false },
];
