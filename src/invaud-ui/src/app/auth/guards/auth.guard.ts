import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { UserResponse } from 'core';
import { Routerlinks } from 'src/app/app-routing.module';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  redirectUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{ user: UserResponse }>,
  ) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.authService.getUserProfile();
    }

    this.redirectUrl = state.url
      .split('redirectTo=%2F')?.[1]
      ?.replace('%2F', '/');
    if (
      this.redirectUrl === Routerlinks.users ||
      this.redirectUrl === Routerlinks.superPassword
    ) {
      this.redirectUrl = null;
    }

    this.reroute();
    return !this.authService.isLoggedIn();
  }

  reroute(): void {
    this.store.select('user').subscribe((user: UserResponse) => {
      if (user) {
        if (this.redirectUrl) {
          this.backToPreviousPage();
        } else {
          this.routeAccordingToUserRole(user);
        }
      }
    });
  }

  backToPreviousPage(): void {
    this.router.navigate([`/${this.redirectUrl}`]);
  }

  routeAccordingToUserRole(user: UserResponse): void {
    if (user.role === 'admin') {
      this.router.navigate([Routerlinks.users]);
    } else if (user.role === 'super_admin') {
      this.router.navigate([Routerlinks.superPassword]);
    } else {
      this.router.navigate([Routerlinks.invoices]);
    }
  }
}
