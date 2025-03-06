export interface Payment {
    id: string;
    orderId: number;
    totalPrice: number;
    status: PaymentStatus;
}

export enum PaymentStatus {
    Paid = 'PAID',
    Pending = 'PENDING',
    Failed = 'FAILED'
}
