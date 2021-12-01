import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { identity, Observable, of, throwError } from 'rxjs';
import { catchError, first, retry } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (this.isNotAuthRoute(request) && !this.isRefreshing) {
      if (!this.authService.isLoggedIn()) {
        this.authService.getUserProfile();
      }
      if (!this.isValidAccessToken()) {
        this.attemptRefresh();
      }
    }
    return this.handleRequest(request, next);
  }

  private handleRequest(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      this.isNotAuthRoute ? retry(1) : identity,
      catchError((error): Observable<any> => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (
            request.url === '/api/auth/refresh' ||
            request.url === '/api/users/current' ||
            request.url === '/api/auth/logout'
          ) {
            return of(null);
          } else {
            this.authService.logout();
            return throwError(error);
          }
        } else {
          return throwError(error);
        }
      }),
    );
  }

  private attemptRefresh(): void {
    this.isRefreshing = true;
    this.authService
      .refreshToken()
      .pipe(first())
      .subscribe(
        (res) => {
          this.isRefreshing = false;
          this.authService.setExpiryTimeInStore(res.expires);
        },
        (err) => {
          this.isRefreshing = false;
          throwError(err);
        },
      );
  }

  isNotAuthRoute(request: HttpRequest<any>): boolean {
    return (
      request.url !== '/api/users/current' &&
      request.url !== '/api/auth/refresh' &&
      request.url !== '/api/auth/login' &&
      request.url !== '/api/auth/logout'
    );
  }

  private isValidAccessToken(): boolean {
    const expiryTime = this.authService.getExpiryTimeFromStore();
    return new Date() < expiryTime;
  }
}
