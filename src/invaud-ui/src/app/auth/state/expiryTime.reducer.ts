import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { clearExpiryTime, setExpiryTime } from './expiryTime.actions';

export const initialState = null;

const _expiryTimeReducer = createReducer(
  initialState,
  on(setExpiryTime, (_state, Date) => Date),
  on(clearExpiryTime, () => null),
);

export function expiryTimeReducer(
  state: Date,
  action: TypedAction<string>,
): ActionReducer<Date, Action> {
  return _expiryTimeReducer(state, action);
}
