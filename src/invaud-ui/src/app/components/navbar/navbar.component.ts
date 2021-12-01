import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserResponse } from 'core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Routerlinks } from '../../app-routing.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userProfile: UserResponse;
  admin = false;
  userlinks: { route: string; label: string }[] = [
    { route: Routerlinks.reconciliation, label: 'Reconciliation' },
    { route: Routerlinks.invoices, label: 'Invoices & Charges' },
    { route: Routerlinks.configuration, label: 'Configurations' },
  ];

  adminlinks: { route: string; label: string }[] = [
    { route: Routerlinks.users, label: 'User Management' },
    { route: Routerlinks.configuration, label: 'Configurations' },
  ];

  superAdminlinks: { route: string; label: string }[] = [
    { route: Routerlinks.superPassword, label: 'Reset Password' },
    { route: Routerlinks.users, label: 'User Management' },
  ];

  navlinks = this.userlinks;

  constructor(
    private store: Store<{ user: UserResponse }>,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.store.select('user').subscribe((user: UserResponse) => {
      this.userProfile = user;
      if (user?.role === 'admin') {
        this.navlinks = this.adminlinks;
      } else if (user?.role === 'super_admin') {
        this.navlinks = this.superAdminlinks;
      } else {
        this.navlinks = this.userlinks;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
