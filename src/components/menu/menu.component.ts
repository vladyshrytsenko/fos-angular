import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
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
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Modal } from 'bootstrap';
import { PopularDishesService } from '../../service/popular-dishes.service';
import { PopularDish } from '../../model/popular-dish';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  public admin!: boolean;

  public drinks!: Drink[];
  public selectedDrinkNames: string[] = [];

  public desserts!: Dessert[];
  public selectedDessertNames: string[] = [];

  public meals!: Meal[];
  public selectedMealNames: string[] = [];

  public popularDishes: PopularDish[] = [];
  public selectedPopularNames: string[] = [];
  public isPopularSelected: boolean = false;

  cuisines: Cuisine[] = [];
  selectedCuisine!: Cuisine;

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
    paymentId: '',
    iceCubes: false,
    lemon: false
  };

  public orderCustom: { 
    drinkNames: string[], 
    mealNames: string[], 
    dessertNames: string[], 
    totalPrice: number} = {
      drinkNames: [],
      mealNames: [],
      dessertNames: [],
      totalPrice: 0
  };

  constructor(
    private cuisineService: CuisineService,
    private drinkService: DrinkService,
    private dessertService: DessertService,
    private mealService: MealService,
    private orderService: OrderService,
    private popularDishesService: PopularDishesService,
    private userService: UserService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.findPopularDishes();
    this.findAllDrinks();
    this.findAllDesserts();
    this.findAllMeals();

    this.cuisineService.findAll().subscribe(
      (response: Cuisine[]) => {
        this.cuisines = response
      },
      (error) => {
        console.error('Error loading cuisines:', error);
      }
    );

    this.admin = this.userService.isAdmin();
  }

  showCreateDrinkModal(): void {
    const modalElement = this.el.nativeElement.querySelector('#createDrinkModal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  showCreateMealModal(): void {
    const modalElement = this.el.nativeElement.querySelector('#createMealModal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  showCreateCuisineModal(): void {
    const modalElement = this.el.nativeElement.querySelector('#createCuisineModal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  showCreateDessertModal(): void {
    const modalElement = this.el.nativeElement.querySelector('#createDessertModal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  public selectDrink(drinkName: string, price: number): void {
    if (this.selectedDrinkNames.includes(drinkName)) {
      // Deselect the drink
      this.selectedDrinkNames.splice(this.selectedDrinkNames.indexOf(drinkName), 1);
      this.orderCustom.drinkNames.splice(this.orderCustom.drinkNames.indexOf(drinkName), 1);
      
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    } else {
      // Select a new drink
      this.selectedDrinkNames.push(drinkName);
      if (!this.orderCustom.drinkNames.includes(drinkName)) {
        this.orderCustom.drinkNames.push(drinkName);
        this.orderCustom.totalPrice += price;
      }
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectPopular(popularName: string, price: number): void {
    // Deselect the dish from popular
    if (this.selectedPopularNames.includes(popularName)) {
      this.mealService.getByName(popularName).subscribe(
        (_response: Meal) => {
          this.orderCustom.mealNames.splice(this.orderCustom.mealNames.indexOf(popularName), 1);
        },
        (_error) => {
          this.orderCustom.dessertNames.splice(this.orderCustom.dessertNames.indexOf(popularName), 1);
        });
      
      this.selectedPopularNames.splice(this.selectedPopularNames.indexOf(popularName), 1);
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    // Select a new popular
    } else {
      this.mealService.getByName(popularName).subscribe(
        (_response: Meal) => {
          this.orderCustom.mealNames.push(popularName);
        },
        (_error) => {
          this.orderCustom.dessertNames.push(popularName);
        });
      this.selectedPopularNames.push(popularName);
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectMeal(mealName: string, price: number): void {
    // Deselect the meal
    if (this.selectedMealNames.includes(mealName)) {

      this.orderCustom.mealNames.splice(this.orderCustom.mealNames.indexOf(mealName), 1);
      this.selectedMealNames.splice(this.selectedMealNames.indexOf(mealName), 1);

      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    // Select a new meal
    } else {
      this.selectedMealNames.push(mealName);
      if (!this.orderCustom.mealNames.includes(mealName)) {
        this.orderCustom.mealNames.push(mealName);
        this.orderCustom.totalPrice += price;
      }
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectDessert(dessertName: string, price: number): void {
    // Deselect the dessert
    if (this.selectedDessertNames.includes(dessertName)) {

      this.orderCustom.dessertNames.splice(this.orderCustom.dessertNames.indexOf(dessertName), 1);
      this.selectedDessertNames.splice(this.selectedDessertNames.indexOf(dessertName), 1);

      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    // Select a new dessert
    } else {
      this.selectedDessertNames.push(dessertName);
      if (!this.orderCustom.dessertNames.includes(dessertName)) {
        this.orderCustom.dessertNames.push(dessertName);
        this.orderCustom.totalPrice += price;
      }
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public submitOrder(): void {
    console.log('Order submitted:', this.orderCustom);
    this.order.drinkNames = this.orderCustom.drinkNames;
    this.order.iceCubes = true;
    this.order.lemon = true;
    this.order.mealNames = this.orderCustom.mealNames;
    this.order.dessertNames = this.orderCustom.dessertNames;
    this.order.totalPrice = parseFloat(this.orderCustom.totalPrice.toFixed(2)) * 100; // in cents

    this.orderService.create(this.order).subscribe(
      (createdOrder: Order) => {
        console.log('Order created successfully:', createdOrder);
        this.router.navigate([`/payment/${createdOrder.payment?.id}`], {
          queryParams: { totalPrice: this.order.totalPrice }
        });
      },
      (error) => {
        console.error('Order creation failed:', error);
        alert('Failed to create order. Please try again.');
      }
    );
  }

  public findPopularDishes(): void {
    this.popularDishesService.findAll().subscribe( 
      (response: Map<string, string[]>) => {
        Object.entries(response).forEach( ([key, value]) => {
          const valueArray: string[] = value as string[];

          if (key === 'MEAL') {
            valueArray.forEach(item => {
              this.mealService.getByName(item).subscribe(
                (response: Meal) => {
                  const dish: PopularDish = {
                    name: response.name,
                    cuisineName: response.cuisineName,
                    price: response.price,
                    portionWeight: response.portionWeight
                  }

                  this.popularDishes.push(dish);
                }
              );
            });
          } else if (key === 'DESSERT') {
            valueArray.forEach(item => {
              this.dessertService.getByName(item).subscribe(
                (response: Dessert) => {
                  const dish: PopularDish = {
                    name: response.name,
                    price: response.price,
                    portionWeight: response.portionWeight
                  }

                  this.popularDishes.push(dish);
                }
              );
            });
          }
        });

        console.log('popular: ', this.popularDishes);
      },
      error => {
        alert(error.message);
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

  public onCreateMeal(createMealForm: NgForm): void {
    if (createMealForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const meal = createMealForm.value;
  
    console.log('Meal data:', meal);
    this.mealService.create(meal).subscribe(
      (response) => {
        console.log('Meal created successfully:', response);
        createMealForm.reset();
        location.reload();
      },
      (error) => {
        console.error('Error creating meal:', error);
        alert('Failed to create meal. Please try again.');
      }
    );
  }

  public onCreateCuisine(createCuisineForm: NgForm): void {
    if (createCuisineForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const cuisine = createCuisineForm.value;
  
    console.log('Cuisine data:', cuisine);
    this.cuisineService.create(cuisine).subscribe(
      (response) => {
        console.log('Cuisine created successfully:', response);
        createCuisineForm.reset();
        location.reload();
      },
      (error) => {
        console.error('Error creating cuisine:', error);
        alert('Failed to create cuisine. Please try again.');
      }
    );
  }

  public onCreateDrink(createDrinkForm: NgForm): void {
    if (createDrinkForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const drink = createDrinkForm.value;
  
    console.log('Drink data:', drink);
    this.drinkService.create(drink).subscribe(
      (response) => {
        console.log('Drink created successfully:', response);
        createDrinkForm.reset();
        location.reload();
      },
      (error) => {
        console.error('Error creating drink:', error);
        alert('Failed to create drink. Please try again.');
      }
    );
  }

  public onCreateDessert(createDessertForm: NgForm): void {
    if (createDessertForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const dessert = createDessertForm.value;
  
    console.log('Dessert data:', dessert);
    this.dessertService.create(dessert).subscribe(
      (response) => {
        console.log('Dessert created successfully:', response);
        createDessertForm.reset();
        location.reload();
      },
      (error) => {
        console.error('Error creating dessert:', error);
        alert('Failed to create dessert. Please try again.');
      }
    );
  }  

}
