import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { UserResponse } from 'core';
import { setProfile, clearProfile } from './user.actions';

export const initialState = null;

const _userReducer = createReducer(
  initialState,
  on(setProfile, (_state, userProfile) => userProfile),
  on(clearProfile, () => null),
);

export function userReducer(
  state: UserResponse,
  action: TypedAction<string>,
): ActionReducer<UserResponse, Action> {
  return _userReducer(state, action);
}
