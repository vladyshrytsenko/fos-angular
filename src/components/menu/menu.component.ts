import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DrinkService } from '../../service/drink.service';
import { CuisineService } from '../../service/cuisine.service';
import { DessertService } from '../../service/dessert.service';
import { MealService } from '../../service/meal.service';
import { Drink } from '../../model/drink';
import { Dessert } from '../../model/dessert';
import { Meal } from '../../model/meal';
import { Cuisine } from '../../model/cuisine';
import { Order } from '../../model/order';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  public drinks!: Drink[];
  public selectedDrinkId: number | null = null;
  public isDrinkSelected: boolean = false;

  public desserts!: Dessert[];
  public selectedDessertId: number | null = null;
  public isDessertSelected: boolean = false;

  public meals!: Meal[];
  public selectedMealId: number | null = null;
  public isMealSelected: boolean = false;

  public order: Order = {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: new Date(0),
    totalPrice: 0,
    dessertId: 0,
    mealId: 0,
    drinkId: 0,
    iceCubes: false,
    lemon: false
  };

  public orderCustom = {
    drinkId: null as number | null,
    mealId: null as number | null,
    dessertId: null as number | null,
    totalPrice: 0
  };

  constructor(
    private cuisineService: CuisineService,
    private drinkService: DrinkService,
    private dessertService: DessertService,
    private mealService: MealService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.findAllDrinks();
    this.findAllDesserts();
    this.findAllMeals();
  }

  public selectDrink(drinkId: number, price: number): void {
    if (this.selectedDrinkId === drinkId) {
      // Deselect the drink
      this.selectedDrinkId = null;
      this.orderCustom.drinkId = null;
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      // Select a new drink
      this.selectedDrinkId = drinkId;
      this.orderCustom.drinkId = drinkId;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectMeal(mealId: number, price: number): void {
    if (this.selectedMealId === mealId) {
      this.orderCustom.mealId = null;
      this.selectedMealId = null;
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      this.orderCustom.mealId = mealId;
      this.selectedMealId = mealId;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectDessert(dessertId: number, price: number): void {
    if (this.selectedDessertId === dessertId) {
      this.orderCustom.dessertId = null;
      this.selectedDessertId = null;
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      this.orderCustom.dessertId = dessertId;
      this.selectedDessertId = dessertId;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public submitOrder(): void {
    console.log('Order submitted:', this.order);
    
  }

  public findAllDrinks(): void {
    this.drinkService.findAll().subscribe( 
      (response: Drink[]) => {
        this.drinks = response;
        console.log('drinks: ', response);
      },
      error => {
        alert(error.message);
      } 
    );
  }

  public findAllDesserts(): void {
    this.dessertService.findAll().subscribe( 
      (response: Dessert[]) => {
        this.desserts = response.map(dessert => {
          this.cuisineService.getById(dessert.cuisineId).subscribe(
            (cuisine: Cuisine) => {
              dessert.cuisineName = cuisine.name;
            },
            (error) => {
              console.error("Error fetching cuisine:", error);
              dessert.cuisineName = "Unknown";
            }
          );
          return dessert;
        });
        console.log('desserts: ', response);
      },
      error => {
        alert(error.message);
      } 
    );
  }

  public findAllMeals(): void {
    this.mealService.findAll().subscribe( 
      (response: Meal[]) => {
        this.meals = response.map(meal => {
          this.cuisineService.getById(meal.cuisineId).subscribe(
            (cuisine: Cuisine) => {
              meal.cuisineName = cuisine.name;
            },
            (error) => {
              console.error("Error fetching cuisine:", error);
              meal.cuisineName = "Unknown";
            }
          );
          return meal;
        });
      },
      error => {
        alert(error.message);
      } 
    );
  }

}
