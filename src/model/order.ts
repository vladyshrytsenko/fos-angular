import { Dessert } from "./dessert";
import { Drink } from "./drink";
import { Meal } from "./meal";
import { Payment } from "./payment";

export interface Order {
    id: number;
    createdAt: Date;
    createdBy?: number;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    totalPrice: number;
    dessertId: number;
    desserts?: Dessert[];
    mealId: number;
    meals?: Meal[];
    drinkId: number;
    drinks?: Drink[];
    paymentId: string;
    payment?: Payment;
    dessertNames?: string[];
    mealNames?: string[];
    drinkNames?: string[];
    iceCubes: boolean;
    lemon: boolean;
}
