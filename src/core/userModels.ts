import { UserRole } from './enums.prisma';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  locked: boolean;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserEditRequest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserEditPasswordRequest {
  id: string;
  password: string;
}
