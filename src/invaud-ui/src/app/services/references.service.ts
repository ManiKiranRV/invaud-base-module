import { Injectable } from '@angular/core';
import { ReferenceView } from 'core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReferencesService {
  references: ReferenceView[] = [
    {
      id: '1',
      qualifier: 'ASL',
      description: 'Agreed Service Level',
      value: 'def',
      invoiceNumber: 'PLACEHOLDER',
    },
    {
      id: '2',
      qualifier: 'CRF',
      description: 'Consignee Ref',
      value: '013456789',
      invoiceNumber: 'PLACEHOLDER',
    },
    {
      id: '3',
      qualifier: 'CRF',
      description: 'Consignee Ref',
      value: '987654321',
      invoiceNumber: 'PLACEHOLDER',
    },
  ];

  getReferences(
    page: number,
    numberPerPage: number,
  ): Observable<ReferenceView[]> {
    return of(
      this.references.slice((page - 1) * numberPerPage, page * numberPerPage),
    );
  }

  getTotalNumberOfRows() {
    return of(this.references.length);
  }
}
