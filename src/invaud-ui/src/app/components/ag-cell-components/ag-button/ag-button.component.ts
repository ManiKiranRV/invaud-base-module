import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { UserRole } from 'core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-ag-button',
  templateUrl: './ag-button.component.html',
})
export class AgButtonComponent {
  cellValue: string;
  rowIndex: number;
  disabled: boolean;
  params: any;
  userRole: UserRole;

  constructor(private authService: AuthService) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.userRole = this.authService.getUserFromStore().role;
    this.rowIndex = params.rowIndex;

    this.disabledStatus();
  }

  disabledStatus() {
    if (this.userRole === 'shipper') {
      this.disabled = this.params?.data?.status !== 'Pending';
    } else if (this.userRole === 'forwarder') {
      this.disabled = this.params?.data?.status !== 'Rejected';
    }
  }

  onClick(buttonClicked: string) {
    this.params.clicked(this.rowIndex, buttonClicked);
  }
}
