import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from 'core';
import { Observable, of } from 'rxjs';
import { calculateSkip } from '../helpers/calculateSkip';
import { SearchParams } from '../models/agModels';
import { SortParams } from '../models/agSearchParams';
import { ReconciliationOverview } from '../models/reconciliationModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ReconciliationService {
  reconciliationEndpoint = '/api/reconciliation';
  constructor(private http: HttpClient) {}

  getData(
    searchParams: SearchParams,
    sortParams: SortParams,
    page: number,
  ): Observable<Paginated<ReconciliationOverview>> {
    const skip = calculateSkip(page);
    const endpoint = `${this.reconciliationEndpoint}/overview?skip=${skip}`;

    return of({
      data: [
        {
          invoiceNumber: 'string',
          level: 'string',
          invoiceDate: 'string',
          chargeCode: 'string',
          chargeDescription: 'string',
          chargeAmount: 'string',
          chargeCurrency: 'string',
          result: true,
        },
        {
          invoiceNumber: 'string',
          level: 'string',
          invoiceDate: 'string',
          chargeCode: 'string',
          chargeDescription: 'string',
          chargeAmount: 'string',
          chargeCurrency: 'string',
          result: false,
        },
      ],
      numberOfRecords: 3,
    });
    // return this.http.post<Paginated<ReconciliationOverview>>(
    //   endpoint,
    //   { searchParams, sortParams },
    //   httpOptions,
    // );
  }
}
