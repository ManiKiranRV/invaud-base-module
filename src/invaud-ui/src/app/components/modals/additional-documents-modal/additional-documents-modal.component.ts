import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-additional-documents-modal',
  templateUrl: './additional-documents-modal.component.html',
  styleUrls: ['./additional-documents-modal.component.css']
})
export class AdditionalDocumentsModalComponent implements OnInit {
  @Input() modal: boolean;
  @Output() closeModalEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    
  }


  closeModal(): void {
    
    this.closeModalEvent.emit();
  }

}
