import { Component, OnInit } from '@angular/core';
import { AdditionalDocument } from '../../../../models/AdditionalDocument';
import { AdditionalDocumentsService } from '../../../../services/additional-documents.service';

@Component({
  selector: 'app-additional-documents-tab',
  templateUrl: './additional-documents-tab.component.html',
})
export class AdditionalDocumentsTabComponent implements OnInit {
  additionalDocuments: AdditionalDocument[];
  modal: boolean = false;

  constructor(private documentService: AdditionalDocumentsService) {}

  ngOnInit(): void {
    this.documentService
      .getDocuments()
      .subscribe((docs) => (this.additionalDocuments = docs));
  }

  openModal(): void {
    this.modal = true;
  }

  closeModal(): void {
    this.modal = false;
  }
}
