import { Component, EventEmitter, Output } from '@angular/core';
import { InvoiceStatus } from 'src/app/constants/statusEnum';
import { noSort } from 'src/app/helpers/htmlHelperFunctions';


@Component({
  selector: 'app-navtabs',
  templateUrl: './navtabs.component.html',
  styleUrls: ['./navtabs.component.css'],
})
export class NavtabsComponent {
  @Output() onActiveTabChange = new EventEmitter<keyof typeof InvoiceStatus>();
  noSort = noSort;
  
  tabs = InvoiceStatus;
  active: keyof typeof InvoiceStatus = InvoiceStatus.All;

  setActive(tab: string): void {
    if (this.stringIsInEnum(tab)) {
      let tabAsEnumKey = tab as keyof typeof InvoiceStatus;
      if (this.tabHasChanged(tabAsEnumKey)) {
        this.active = tabAsEnumKey;
        this.onActiveTabChange.emit(tabAsEnumKey);
      }
    }
  }

  stringIsInEnum(testString: string): boolean {
    return Object.keys(InvoiceStatus).some((key) => key === testString);
  }

  tabHasChanged(newTab: keyof typeof InvoiceStatus) {
    return this.active !== newTab;
  }
}
