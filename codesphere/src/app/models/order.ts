export interface Order {
  id: string,
  orderCode: string,
  amount: number,
  amountPaid: number,
  amountRemaining: number,
  status: string,
  createdAt: string,
  transactions: any[],
  cancellationReason: string,
  canceledAt: string
}
