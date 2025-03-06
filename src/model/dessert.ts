
export interface Dessert {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    name: string;
    price: number;
    portionWeight: number;
    number: number;
}
