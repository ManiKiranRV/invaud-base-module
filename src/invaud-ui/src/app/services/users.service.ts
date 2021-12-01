import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated, UserResponse } from 'core';
import { Observable } from 'rxjs';
import { calculateSkip } from 'src/app/helpers/calculateSkip';
import { SortParams, UsersSearchParams } from 'src/app/models/agSearchParams';
import { newUserRequest } from '../models/helper-models';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userEndpoint = '/api/users';
  constructor(private http: HttpClient) {}

  getUsers(
    searchParams: UsersSearchParams,
    sortParams: SortParams,
    page: number,
  ): Observable<Paginated<UserResponse>> {
    const skip = calculateSkip(page);
    const endpoint = `${this.userEndpoint}?skip=${skip}`;
    return this.http.post<Paginated<UserResponse>>(
      endpoint,
      { searchParams, sortParams },
      httpOptions,
    );
  }

  register(newUser: newUserRequest): Observable<UserResponse> {
    const endpoint = `${this.userEndpoint}/register`;
    return this.http.post<UserResponse>(endpoint, newUser, httpOptions);
  }

  delete(id: string): Observable<UserResponse> {
    const endpoint = `${this.userEndpoint}/${id}`;
    return this.http.delete<UserResponse>(endpoint);
  }

  put(user: newUserRequest): Observable<UserResponse> {
    const endpoint = `${this.userEndpoint}`;
    return this.http.put<UserResponse>(endpoint, user, httpOptions);
  }

  changePassword(payload: {
    id: string;
    password: string;
  }): Observable<UserResponse> {
    const endpoint = `${this.userEndpoint}/password`;
    return this.http.put<UserResponse>(endpoint, payload, httpOptions);
  }
}
