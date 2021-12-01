export type UserRole =
  | 'shipper'
  | 'forwarder'
  | 'fba'
  | 'admin'
  | 'super_admin';
export const UserRole: {
  shipper: 'shipper';
  forwarder: 'forwarder';
  fba: 'fba';
  admin: 'admin';
  super_admin: 'super_admin';
} = {
  shipper: 'shipper',
  forwarder: 'forwarder',
  fba: 'fba',
  admin: 'admin',
  super_admin: 'super_admin',
};

export type InvoiceStatus =
  | 'Proforma'
  | 'Adaptation'
  | 'Posted'
  | 'Reconciled'
  | 'Released'
  | 'Settled'
  | 'Exception';
export const InvoiceStatus: {
  Proforma: 'Proforma';
  Adaptation: 'Adaptation';
  Posted: 'Posted';
  Reconciled: 'Reconciled';
  Released: 'Released';
  Settled: 'Settled';
  Exception: 'Exception';
} = {
  Proforma: 'Proforma',
  Adaptation: 'Adaptation',
  Posted: 'Posted',
  Reconciled: 'Reconciled',
  Released: 'Released',
  Settled: 'Settled',
  Exception: 'Exception',
};

export type ChargeLineStatus = 'Pending' | 'Approved' | 'Rejected';
export const ChargeLineStatus: {
  Pending: 'Pending';
  Approved: 'Approved';
  Rejected: 'Rejected';
} = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
};

export type StationType = 'origin' | 'destination';
export const StationType: {
  origin: 'origin';
  destination: 'destination';
} = {
  origin: 'origin',
  destination: 'destination',
};

export type AddressType = 'shipper' | 'consignee' | 'billToParty';
export const AddressType: {
  shipper: 'shipper';
  consignee: 'consignee';
  billToParty: 'billToParty';
} = {
  shipper: 'shipper',
  consignee: 'consignee',
  billToParty: 'billToParty',
};
