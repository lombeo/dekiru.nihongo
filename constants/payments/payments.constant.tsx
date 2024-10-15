interface PaymentProps {
  typePayment?: number;
}
export enum PaymentUnitEnum {
  FOXPAY = 1,
  COUPON = 0,
  VIETQR = 2,
  CODELEARN = 3,
}

export enum VoucherType {
  FOR_PURCHASE = 1,
  FOR_ACTIVE = 2,
}

export type PaymentUnit = {
  type: PaymentUnitEnum;
  label?: string;
  icon?: any;
};

export const PaymentType: Array<PaymentUnit> = [
  {
    label: "FPT Pay",
    type: PaymentUnitEnum.FOXPAY,
    icon: `/images/payment/fpt_pay.png`,
  },
  {
    label: "VietQR",
    type: PaymentUnitEnum.VIETQR,
    icon: `/images/payment/vietqr.png`,
  },
  {
    label: "Coupon",
    type: PaymentUnitEnum.COUPON,
    icon: `/images/payment/coupon.png`,
  },
  {
    label: "Bank transfer payment",
    type: PaymentUnitEnum.CODELEARN,
    icon: `/images/payment/bank.png`,
  },
];

export function getPaymentByNumber(type: any) {
  return PaymentType.find((x) => {
    return x.type === type;
  });
}
export function getPayment(type: PaymentUnitEnum) {
  return PaymentType.find((x) => {
    return x.type === type;
  });
}
