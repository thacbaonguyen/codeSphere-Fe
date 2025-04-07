export interface Payment {
  bin: number,
  accountNumber: number,
  accountName: string,
  amount: number,
  description: string,
  orderCode: number,
  currency: string,
  paymentLinkId: string,
  status: string,
  checkoutUrl: string,
  qrCode: string
}
