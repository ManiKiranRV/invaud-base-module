export type OrderSearchParams = {
  ecomCode?: {
    contains: string | unknown;
  };
  orderNumber?: {
    contains: string | unknown;
  };
  orderStatus?: {
    contains: string | unknown;
  };
  orderDate?: {
    gte: Date | unknown;
    lt: Date | unknown;
  };
  transport?: {
    contains: string | unknown;
  };
  numberOfItems?: {
    equals: number | undefined;
  };
  declarationStatus?: {
    contains: string | unknown;
  };
};

export const emptyOrderSearchparams = {
  ecomCode: {
    contains: '',
  },
  orderNumber: {
    contains: '',
  },
  orderStatus: {
    contains: '',
  },
  orderDate: {
    gte: undefined,
    lt: undefined,
  },
  transport: {
    contains: '',
  },
  numberOfItems: {
    equals: undefined,
  },
  declarationStatus: {
    contains: '',
  },
};
