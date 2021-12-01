import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserResponse } from 'core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Routerlinks } from 'src/app/app-routing.module';
import { clearProfile, setProfile } from 'src/app/auth/state/user.actions';
import { clearExpiryTime, setExpiryTime } from '../state/expiryTime.actions';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedUser: string;
  user$: Observable<UserResponse>;
  endpoint = '/api/auth';
  public loginSuccessful$: EventEmitter<boolean>;

  constructor(
    private http: HttpClient,
    private store: Store<{ user: UserResponse; expiryTime: Date }>,
    private router: Router,
  ) {
    this.loginSuccessful$ = new EventEmitter();
  }

  login(user: { email: string; password: string }): void {
    this.http.post<any>(`${this.endpoint}/login`, user, httpOptions).subscribe(
      (response) => {
        if (response.message === 'success') {
          this.getUserProfile();
          this.loginSuccessful$.emit(true);
          this.setExpiryTimeInStore(response.expires);
        } else {
          this.loginSuccessful$.emit(false);
        }
      },
      () => {
        this.loginSuccessful$.emit(false);
      },
    );
  }

  getUserProfile(): void {
    this.http
      .get<UserResponse>(`/api/users/current`)
      .subscribe((userProfile: UserResponse) => {
        this.store.dispatch(setProfile(userProfile));
      });
  }

  storeUser(userProfile: UserResponse): void {
    this.store.dispatch(setProfile(userProfile));
  }

  isLoggedIn(): boolean {
    return !!this.getUserFromStore();
  }

  isAdmin(): boolean {
    return !!this.getAdminFromStore();
  }

  getAdminFromStore(): boolean {
    let userProfile: UserResponse;
    this.store
      .select('user')
      .pipe(first())
      .subscribe((user: UserResponse) => {
        userProfile = user;
      });
    return userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  }

  getUserFromStore(): UserResponse {
    let userProfile: UserResponse;
    this.store
      .select('user')
      .pipe(first())
      .subscribe((user: UserResponse) => {
        userProfile = user;
      });
    return userProfile;
  }

  setExpiryTimeInStore(time: Date): void {
    this.store.dispatch(setExpiryTime({ expiryTime: time }));
  }

  getExpiryTimeFromStore(): Date {
    let expiryTime: Date;
    this.store.select('expiryTime').subscribe((time: any) => {
      expiryTime = new Date(time?.expiryTime);
    });
    return expiryTime;
  }

  refreshToken(): Observable<{ message: string; expires: Date }> {
    return this.http.post<{ message: string; expires: Date }>(
      `${this.endpoint}/refresh`,
      {},
      httpOptions,
    );
  }

  logout(): void {
    this.http
      .post<{ message: string }>(`${this.endpoint}/logout`, {}, httpOptions)
      .pipe(first())
      .subscribe(
        ({ message }) => {
          this.router.navigate([Routerlinks.login]);
        },
        (err) => {
          this.router.navigate([Routerlinks.login]);
        },
      );
    this.clearUserProfile();
    this.clearExpiryTime();
  }

  clearUserProfile(): void {
    this.store.dispatch(clearProfile());
  }
  clearExpiryTime(): void {
    this.store.dispatch(clearExpiryTime());
  }
}
