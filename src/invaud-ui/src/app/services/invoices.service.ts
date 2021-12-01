import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChargeLineView,
  CreateOrUpdateChargeLineView,
  InvoiceOverview,
  InvoiceView,
  Paginated,
} from 'core';
import { Observable } from 'rxjs';
import { calculateSkip } from '../helpers/calculateSkip';
import { SearchParams } from '../models/agModels';
import { SortParams } from '../models/agSearchParams';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  invoiceEndpoint = '/api/invoices';
  constructor(private http: HttpClient) {}

  getInvoices(
    searchParams: SearchParams,
    sortParams: SortParams,
    page: number,
  ): Observable<Paginated<InvoiceOverview>> {
    const skip = calculateSkip(page);
    const endpoint = `${this.invoiceEndpoint}/overview?skip=${skip}`;
    return this.http.post<Paginated<InvoiceOverview>>(
      endpoint,
      { searchParams, sortParams },
      httpOptions,
    );
  }

  getInvoiceDetails(id: string): Observable<InvoiceView> {
    const endpoint = `${this.invoiceEndpoint}/${id}`;

    return this.http.get<InvoiceView>(endpoint);
  }

  getChargeLines(
    id: string,
    searchParams: SearchParams,
    sortParams: SortParams,
    page: number,
  ): Observable<Paginated<ChargeLineView>> {
    const skip = calculateSkip(page);
    const endpoint = `${this.invoiceEndpoint}/${id}/chargelineoverview?skip=${skip}`;
    return this.http.post<Paginated<ChargeLineView>>(
      endpoint,
      { searchParams, sortParams },
      httpOptions,
    );
  }

  newChargeLine(
    id: string,
    newChargeLine: CreateOrUpdateChargeLineView,
  ): Observable<ChargeLineView> {
    const endpoint = `${this.invoiceEndpoint}/${id}/chargeline`;
    return this.http.post<ChargeLineView>(endpoint, newChargeLine, httpOptions);
  }

  editChargeLine(
    chargeLineId: string,
    newChargeLine: CreateOrUpdateChargeLineView,
  ): Observable<ChargeLineView> {
    const endpoint = `${this.invoiceEndpoint}/chargeline/${chargeLineId}/amend`;
    return this.http.put<ChargeLineView>(endpoint, newChargeLine, httpOptions);
  }

  approveAdditionalCharge(chargeLineId: string): Observable<ChargeLineView> {
    const endpoint = `${this.invoiceEndpoint}/chargeline/${chargeLineId}/approve`;
    return this.http.put<ChargeLineView>(endpoint, {}, httpOptions);
  }

  rejectAdditionalCharge(chargeLineId: string): Observable<ChargeLineView> {
    const endpoint = `${this.invoiceEndpoint}/chargeline/${chargeLineId}/reject`;
    return this.http.put<ChargeLineView>(endpoint, {}, httpOptions);
  }
}
