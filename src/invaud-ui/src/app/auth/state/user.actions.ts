import { createAction, props } from '@ngrx/store';
import { UserResponse } from 'core';

export const setProfile = createAction(
  '[User Profile] Set Profile',
  props<UserResponse>(),
);

export const clearProfile = createAction('[User Profile] Clear Profile');
