import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Routerlinks } from 'src/app/app-routing.module';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate, CanLoad {
  redirectUrl: string;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    this.redirectUrl = state.url;

    return this.canLoad();
  }

  canLoad(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([Routerlinks.login], {
        queryParams: { redirectTo: this.redirectUrl },
      });
    }
    return this.authService.isLoggedIn();
  }
}
