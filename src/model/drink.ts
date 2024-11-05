
export interface Drink {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    name: string;
    price: number;
}