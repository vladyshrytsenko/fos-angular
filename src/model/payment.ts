import { Order } from "./order";

export interface Cuisine {
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