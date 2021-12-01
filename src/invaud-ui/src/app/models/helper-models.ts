import { UserRole } from 'core';

export type newUserRequest = {
  id?: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export const emptyNewUserRequest: newUserRequest = {
  id: null,
  password: null,
  email: null,
  firstName: null,
  lastName: null,
  role: null,
};
