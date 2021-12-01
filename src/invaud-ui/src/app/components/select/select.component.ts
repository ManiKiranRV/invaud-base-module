import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Output() selectedValue: EventEmitter<string> = new EventEmitter();
  selectedOption: string;
  options: string[] = [
    'All orders',
    'Exceptions',
    'Cancelled orders',
    'In transit',
    'Delivered',
    'Final orders',
  ];
  label = 'Choose order status';
  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

  onOptionsSelected(value: string): void {
    this.selectedValue.emit(value);
    this.selectedOption = value;
  }
}
