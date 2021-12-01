import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdditionalDocument } from '../models/AdditionalDocument';

@Injectable({
  providedIn: 'root',
})
export class AdditionalDocumentsService {
  documents: AdditionalDocument[] = [
    {
      title: 'Supplier provided invoice',
      format: 'PDF',
      details: Date().toString(),
    },
    {
      title: 'proforma invoice',
      format: 'PDF',
      details: Date().toString(),
    }
  ];

  getDocuments(): Observable<AdditionalDocument[]> {
    return of(this.documents);
  }
}
