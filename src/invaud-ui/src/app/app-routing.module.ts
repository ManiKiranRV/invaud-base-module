import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminGuard } from './auth/guards/route.admin.guard';
import { RouteGuard } from './auth/guards/route.guard';
import { ConfigurationsComponent } from './components/pages/configurations/configurations.component';
import { InvoiceDetailsComponent } from './components/pages/invoice-details/invoice-details.component';
import { InvoicesAndChargesComponent } from './components/pages/invoices-and-charges/invoices-and-charges.component';
import { LoginComponent } from './components/pages/login/login.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ReconciliationComponent } from './components/pages/reconciliation/reconciliation.component';
import { SuperAdminPasswordComponent } from './components/pages/super-admin-password/super-admin-password.component';
import { UserManagementComponent } from './components/pages/user-management/user-management.component';

// move to constants folder??
export const Routerlinks = {
  home: '',
  login: 'login',
  invoices: 'invoices', // check later
  invoiceDetail: 'invoices/:invoiceNumber',
  reconciliation: 'reconciliation',
  configuration: 'configuration',
  users: 'users',
  superPassword: 'reset-password',
};

const routes: Routes = [
  {
    path: Routerlinks.login,
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Routerlinks.users,
    component: UserManagementComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  },
  {
    path: Routerlinks.superPassword,
    component: SuperAdminPasswordComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
  {
    path: Routerlinks.reconciliation,
    component: ReconciliationComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
  {
    path: Routerlinks.invoices,
    component: InvoicesAndChargesComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
  {
    path: Routerlinks.invoiceDetail,
    component: InvoiceDetailsComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
  {
    path: Routerlinks.configuration,
    component: ConfigurationsComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
  {
    path: '',
    redirectTo: Routerlinks.login,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [RouteGuard],
    canLoad: [RouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
