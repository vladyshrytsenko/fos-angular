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
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  public drinks!: Drink[];
  public selectedDrinkName: string | null = null;
  public isDrinkSelected: boolean = false;

  public desserts!: Dessert[];
  public selectedDessertName: string | null = null;
  public isDessertSelected: boolean = false;

  public meals!: Meal[];
  public selectedMealName: string | null = null;
  public isMealSelected: boolean = false;

  public order: Order = {
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    deletedAt: new Date(0),
    totalPrice: 0,
    dessertId: 0,
    dessertName: '',
    mealId: 0,
    mealName: '',
    drinkId: 0,
    drinkName: '',
    paymentId: '',
    iceCubes: false,
    lemon: false
  };

  public orderCustom = {
    drinkName: '',
    mealName: '',
    dessertName: '',
    totalPrice: 0
  };

  constructor(
    private cuisineService: CuisineService,
    private drinkService: DrinkService,
    private dessertService: DessertService,
    private mealService: MealService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllDrinks();
    this.findAllDesserts();
    this.findAllMeals();
  }

  public selectDrink(drinkName: string, price: number): void {
    if (this.selectedDrinkName === drinkName) {
      // Deselect the drink
      this.selectedDrinkName = null;
      this.orderCustom.drinkName = '';
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      // Select a new drink
      this.selectedDrinkName = drinkName;
      this.orderCustom.drinkName = drinkName;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectMeal(mealName: string, price: number): void {
    if (this.selectedMealName === mealName) {
      this.orderCustom.mealName = '';
      this.selectedMealName = null;
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      this.orderCustom.mealName = mealName;
      this.selectedMealName = mealName;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectDessert(dessertName: string, price: number): void {
    if (this.selectedDessertName === dessertName) {
      this.orderCustom.dessertName = '';
      this.selectedDessertName = null;
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      this.orderCustom.dessertName = dessertName;
      this.selectedDessertName = dessertName;
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public submitOrder(): void {
    console.log('Order submitted:', this.orderCustom);
    this.order.drinkName = this.orderCustom.drinkName;
    this.order.mealName = this.orderCustom.mealName ?? null;
    this.order.dessertName = this.orderCustom.dessertName ?? null;
    this.order.totalPrice = this.orderCustom.totalPrice;

    this.orderService.create(this.order).subscribe(
      (createdOrder: Order) => {
        console.log('Order created successfully:', createdOrder);
        this.router.navigate([`/payment/${createdOrder.paymentId}`]);
      },
      (error) => {
        console.error('Order creation failed:', error);
        alert('Failed to create order. Please try again.');
      }
    );
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
