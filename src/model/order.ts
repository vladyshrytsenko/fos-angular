import { Dessert } from "./dessert";
import { Drink } from "./drink";
import { Meal } from "./meal";

export interface Order {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date;
    totalPrice: number;
    dessertId: number;
    dessert?: Dessert;
    mealId: number;
    meal?: Meal;
    drinkId: number;
    drink?: Drink;
    paymentId: string;
    dessertName: string;
    mealName: string;
    drinkName: string;
    iceCubes: boolean;
    lemon: boolean;
}