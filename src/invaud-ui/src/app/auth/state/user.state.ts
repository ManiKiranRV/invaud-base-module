import { UserResponse } from 'core';

export interface UserState {
  userProfile: Readonly<UserResponse>;
}
