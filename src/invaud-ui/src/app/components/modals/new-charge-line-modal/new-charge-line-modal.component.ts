import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChargeLineView, CreateOrUpdateChargeLineView } from 'core';
import { Currencies } from 'src/app/constants/enums';

@Component({
  selector: 'app-new-charge-line-modal',
  templateUrl: './new-charge-line-modal.component.html',
})
export class NewChargeLineModalComponent implements OnInit {
  @Input() modal: boolean;
  @Input() modalType: string;
  @Input() editValue: ChargeLineView;
  @Output() closeModalEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter<{
    chargeLine: CreateOrUpdateChargeLineView;
    type: string;
  }>();
  currencyCodes = Currencies;
  newChargeLine = {} as CreateOrUpdateChargeLineView;

  constructor() {}

  ngOnInit(): void {
    if (this.editValue && this.modalType === 'edit') {
      this.newChargeLine = {
        amount: this.editValue.amount,
        code: this.editValue.code,
        currency: this.editValue.currency,
        description: this.editValue.description,
      };
    }
  }

  closeModal(): void {
    this.newChargeLine = {} as CreateOrUpdateChargeLineView;
    this.closeModalEvent.emit();
  }

  onSubmit() {
    this.submitEvent.emit({
      chargeLine: this.newChargeLine,
      type: this.modalType,
    });
    this.closeModal();
  }
}
