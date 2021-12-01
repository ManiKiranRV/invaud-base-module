import {
  SearchTypeDate,
  SearchTypeEnum,
  SearchTypeNumber,
  SearchTypeText,
} from './agModels';

export type SortParams = { [x: string]: string }[];

export type InvoiceSearchParams = {
  // id: SearchTypeText;
  invoiceNumber: SearchTypeText;
  // type: SearchTypeText;
  billToParty: SearchTypeText;
  shipper: SearchTypeText;
  consignee: SearchTypeText;
  status: SearchTypeEnum;
  originCode: SearchTypeText;
  destinationCode: SearchTypeText;
  shipmentDate: SearchTypeDate;
  invoiceDate: SearchTypeDate;
  totalValueOfGoods: SearchTypeText;
  lockedBy?: SearchTypeText;
  AND?: InvoiceSearchType[];
  OR?: InvoiceSearchType[];
  NOT?: InvoiceSearchType[];
};

export type InvoiceSearchType = {
  // id: SearchTypeText;
  invoiceNumber: SearchTypeText;
  // type: SearchTypeText;
  billToParty: SearchTypeText;
  shipper: SearchTypeText;
  consignee: SearchTypeText;
  status: SearchTypeText;
  originCode: SearchTypeText;
  destinationCode: SearchTypeText;
  shipmentDate: SearchTypeDate;
  invoiceDate: SearchTypeDate;
  totalValueOfGoods: SearchTypeText;
  lockedBy?: SearchTypeText;
};

export const emptyInvoiceSearchparams: InvoiceSearchParams = {
  invoiceNumber: {},
  billToParty: {},
  shipper: {},
  consignee: {},
  status: {},
  originCode: {},
  destinationCode: {},
  shipmentDate: {
    gte: undefined,
    lt: undefined,
  },
  invoiceDate: {
    gte: undefined,
    lt: undefined,
  },
  totalValueOfGoods: {},
  // lockedBy: {
  //   contains: '',
  // },
};

export type ReferencesSearchParams = {
  id: SearchTypeText;
  qualifier: SearchTypeText;
  description: SearchTypeText;
  value: SearchTypeText;
  AND?: ReferencesSearchType[];
  OR?: ReferencesSearchType[];
  NOT?: ReferencesSearchType[];
};

export type ReferencesSearchType = {
  id: SearchTypeText;
  qualifier: SearchTypeText;
  description: SearchTypeText;
  value: SearchTypeText;
};
export const emptyReferencesSearchParams: ReferencesSearchParams = {
  id: {
    contains: '',
  },
  qualifier: {
    contains: '',
  },
  description: {
    contains: '',
  },
  value: {
    contains: '',
  },
};

export type ChargeLinesSearchParams = {
  id: SearchTypeText;
  code: SearchTypeText;
  description: SearchTypeText;
  amount: SearchTypeText;
  status: SearchTypeEnum;
  additionalCharge: SearchTypeEnum;
  AND?: ChargeLinesSearchType[];
  OR?: ChargeLinesSearchType[];
  NOT?: ChargeLinesSearchType[];
};

export type ChargeLinesSearchType = {
  id: SearchTypeText;
  code: SearchTypeText;
  description: SearchTypeText;
  amount: SearchTypeNumber;
  status: SearchTypeEnum;
  additionalCharge: SearchTypeEnum;
};
export const emptyChargeLinesSearchParams: ChargeLinesSearchParams = {
  id: {},
  code: {},
  description: {},
  amount: {},
  status: {},
  additionalCharge: {},
};

export type ReconciliationSearchParams = {
  invoiceNumber: SearchTypeText;
  level: SearchTypeText;
  invoiceDate: SearchTypeText;
  chargeCode: SearchTypeText;
  chargeDescription: SearchTypeText;
  chargeAmount: SearchTypeText;
  chargeCurrency: SearchTypeText;
  result: SearchTypeText;
  AND?: ChargeLinesSearchType[];
  OR?: ChargeLinesSearchType[];
  NOT?: ChargeLinesSearchType[];
};

export type ReconciliationSearchType = {
  invoiceNumber: SearchTypeText;
  level: SearchTypeText;
  invoiceDate: SearchTypeText;
  chargeCode: SearchTypeText;
  chargeDescription: SearchTypeText;
  chargeAmount: SearchTypeText;
  chargeCurrency: SearchTypeText;
  result: SearchTypeText;
};
export const emptyReconciliationSearchParams: ReconciliationSearchParams = {
  invoiceNumber: {},
  level: {},
  invoiceDate: {},
  chargeCode: {},
  chargeDescription: {},
  chargeAmount: {},
  chargeCurrency: {},
  result: {},
};

export type UsersSearchParams = {
  id?: SearchTypeText;
  email?: SearchTypeText;
  firstName?: SearchTypeText;
  lastName?: SearchTypeText;
  role?: SearchTypeText;
  AND?: UsersSearchType[];
  OR?: UsersSearchType[];
  NOT?: UsersSearchType[];
};

type UsersSearchType = {
  id?: SearchTypeText;
  email?: SearchTypeText;
  firstName?: SearchTypeText;
  lastName?: SearchTypeText;
  role?: SearchTypeText;
};

export const emptyUsersSearchparams: UsersSearchParams = {
  id: {
    contains: '',
  },
  email: {
    contains: '',
  },
  firstName: {
    contains: '',
  },
  lastName: {
    contains: '',
  },
  role: {
    equals: undefined,
  },
};
