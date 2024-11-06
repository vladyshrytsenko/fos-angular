
export interface Order {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    totalPrice: number;
    dessertId: number;
    mealId: number;
    drinkId: number;
    paymentId: string;
    dessertName: string;
    mealName: string;
    drinkName: string;
    iceCubes: boolean;
    lemon: boolean;
}