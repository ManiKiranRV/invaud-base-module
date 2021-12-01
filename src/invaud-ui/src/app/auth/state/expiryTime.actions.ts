import { createAction, props } from '@ngrx/store';

export const setExpiryTime = createAction(
  '[Access token expiry] Set expiry date',
  props<{ expiryTime: Date }>(),
);

export const clearExpiryTime = createAction(
  '[Access token expiry] Clear expiry date',
);
