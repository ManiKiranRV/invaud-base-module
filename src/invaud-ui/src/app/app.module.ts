import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { expiryTimeReducer } from './auth/state/expiryTime.reducer';
import { userReducer } from './auth/state/user.reducer';
import { AgButtonComponent } from './components/ag-cell-components/ag-button/ag-button.component';
import { AgCellIconComponent } from './components/ag-cell-components/ag-cell-icon/ag-cell-icon.component';
import { AgCellLockerComponent } from './components/ag-cell-components/ag-cell-locker/ag-cell-locker.component';
import { AggridComponent } from './components/aggrid/aggrid.component';
import { AnimatedChevronComponent } from './components/animated-chevron/animated-chevron.component';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { ErrorFeedbackComponent } from './components/error-feedback/error-feedback.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LockerComponent } from './components/locker/locker.component';
import { AdditionalDocumentsModalComponent } from './components/modals/additional-documents-modal/additional-documents-modal.component';
import { ModalTemplateComponent } from './components/modals/modal-template/modal-template.component';
import { NewChargeLineModalComponent } from './components/modals/new-charge-line-modal/new-charge-line-modal.component';
import { ServiceTypeModalComponent } from './components/modals/service-type-modal/service-type-modal.component';
import { UserModalComponent } from './components/modals/user-modal/user-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavtabsComponent } from './components/navtabs/navtabs.component';
import { ConfigurationsComponent } from './components/pages/configurations/configurations.component';
import { AdditionalChargesTabComponent } from './components/pages/invoice-details/additional-charges-tab/additional-charges-tab.component';
import { AdditionalDocumentsTabComponent } from './components/pages/invoice-details/additional-documents-tab/additional-documents-tab.component';
import { ChargeLinesTabComponent } from './components/pages/invoice-details/charge-lines-tab/charge-lines-tab.component';
import { EventChainComponent } from './components/pages/invoice-details/event-chain/event-chain.component';
import { InvoiceDetailsComponent } from './components/pages/invoice-details/invoice-details.component';
import { PartyDetailsCardComponent } from './components/pages/invoice-details/party-details-card/party-details-card.component';
import { LocationRowComponent } from './components/pages/invoice-details/proforma-details-tab/location-row/location-row.component';
import { ProformaDetailsTabComponent } from './components/pages/invoice-details/proforma-details-tab/proforma-details-tab.component';
import { ReferencesTabComponent } from './components/pages/invoice-details/references-tab/references-tab.component';
import { InvoicesAndChargesComponent } from './components/pages/invoices-and-charges/invoices-and-charges.component';
import { LoginComponent } from './components/pages/login/login.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ReconciliationComponent } from './components/pages/reconciliation/reconciliation.component';
import { SuperAdminPasswordComponent } from './components/pages/super-admin-password/super-admin-password.component';
import { UserManagementComponent } from './components/pages/user-management/user-management.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RowCounterComponent } from './components/row-counter/row-counter.component';
import { SelectComponent } from './components/select/select.component';
import { EnumToHtmlArrayPipe } from './pipes/enum-to-html-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    NavbarComponent,
    SelectComponent,
    LoaderComponent,
    InvoicesAndChargesComponent,
    ConfigurationsComponent,
    NavtabsComponent,
    InvoiceDetailsComponent,
    PartyDetailsCardComponent,
    ProformaDetailsTabComponent,
    ReferencesTabComponent,
    ChargeLinesTabComponent,
    AdditionalDocumentsTabComponent,
    PaginationComponent,
    RowCounterComponent,
    AggridComponent,
    UserManagementComponent,
    UserModalComponent,
    ModalTemplateComponent,
    SuperAdminPasswordComponent,
    LockerComponent,
    ErrorFeedbackComponent,
    CloseButtonComponent,
    LoginComponent,
    ServiceTypeModalComponent,
    NewChargeLineModalComponent,
    ButtonGroupComponent,
    AdditionalDocumentsModalComponent,
    BannerComponent,
    AgCellLockerComponent,
    AnimatedChevronComponent,
    EnumToHtmlArrayPipe,
    EventChainComponent,
    LocationRowComponent,
    ReconciliationComponent,
    AgCellIconComponent,
    AdditionalChargesTabComponent,
    AgButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([]),
    StoreModule.forRoot({ user: userReducer, expiryTime: expiryTimeReducer }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
