import { Request } from 'express';
import { UserResponse } from 'core';

export interface UserRequest extends Request {
  user: UserEnriched;
}

export interface UserEnriched extends UserResponse {
  passwordChangeRequired: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthToken {
  issuer: string;
  email: string;
  sub: string;
}
