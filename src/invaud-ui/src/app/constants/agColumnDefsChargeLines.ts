export const chargeLinesColumnDefs: any[] = [
  { field: 'code', headerName: 'Charge Code' },
  { field: 'description', headerName: 'Description' },
  { field: 'currency', headerName: 'Charge Currency' },
  {
    field: 'amount',
    headerName: 'Charge amount',
    filter: 'agNumberColumnFilter',
  },
];
export const additionalChargesColumnDefs: any[] = [
  { field: 'code', headerName: 'Charge Code' },
  { field: 'description', headerName: 'Description' },
  { field: 'currency', headerName: 'Charge Currency' },
  { field: 'status', headerName: 'Status', filter: false },
  {
    field: 'amount',
    headerName: 'Charge amount',
    filter: 'agNumberColumnFilter',
  },
];
