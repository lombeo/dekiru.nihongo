export const PAYMENT_PROVIDERS = [
  { id: 2, type: "VietQR", icon: `/images/payment/vietqr_2.png`, label: "Payment by VietQR" },
  { id: 1, type: "FoxPay", icon: `/images/payment/fpt_pay_2.png`, label: "Payment by FPT Pay" },
  {
    id: 3,
    type: "Dekiru",
    icon: null,
    label: "Bank transfer payment",
    isHidden: process.env.NODE_ENV === "production",
  },
];

export enum PAYMENT_PROVIDER {
  VietQR = 2,
  FoxPay = 1,
  Dekiru = 3,
}

export enum BuyType {
  Product = 0,
  Cart = 1,
  Voucher = 2,
}
