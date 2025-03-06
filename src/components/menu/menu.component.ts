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
  public drinkCurrentPage: number = 0;
  public drinkPageSize: number = 5;
  public drinkTotalElements: number = 0;
  public drinkTotalPages: number = 0;

  public desserts!: Dessert[];
  public dessertCurrentPage: number = 0;
  public dessertPageSize: number = 5;
  public dessertTotalElements: number = 0;
  public dessertTotalPages: number = 0;

  public meals!: Meal[];
  public mealCurrentPage: number = 0;
  public mealPageSize: number = 5;
  public mealTotalElements: number = 0;
  public mealTotalPages: number = 0;

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
    drinks: Drink[], 
    meals: Meal[], 
    desserts: Dessert[], 
    totalPrice: number} = {
      drinks: [],
      meals: [],
      desserts: [],
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
    this.admin = this.userService.isAdmin();

    this.findPopularDishes();
    this.findAllDrinks();
    this.findAllDesserts();
    this.findAllMeals();

    this.cuisineService.findAll().subscribe(
      response => {
        this.cuisines = response.content;
      },
      error => {
        console.error('Error loading cuisines:', error);
      }
    );
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

  public selectDrink(drink: Drink): void {
    const isDrinkExistsInOrder = this.orderCustom.drinks.includes(drink);
      // .some(drink => drink.name === drinkName);

    if (isDrinkExistsInOrder) {
      // Deselect the drink
      this.orderCustom.drinks = this.orderCustom.drinks
        .filter(d => d !== drink);

      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= drink.price) {
        this.orderCustom.totalPrice -= drink.price;
      }
    } else {
      // Select a new drink
      this.orderCustom.drinks.push(drink);
      this.orderCustom.totalPrice += drink.price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectPopular(popularName: string, price: number): void {
    // Deselect the dish from popular
    if (this.selectedPopularNames.includes(popularName)) {
      this.mealService.getByName(popularName).subscribe(
        () => {
          this.orderCustom.meals = this.orderCustom.meals
          .filter(meal => meal.name !== popularName);
        },
        (_error) => {
          this.orderCustom.desserts = this.orderCustom.desserts
          .filter(dessert => dessert.name !== popularName);
        });
      
      this.selectedPopularNames.splice(this.selectedPopularNames.indexOf(popularName), 1);
      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= price) {
        this.orderCustom.totalPrice -= price;
      }
    // Select a new popular
    } else {
      this.mealService.getByName(popularName).subscribe(
        (meal: Meal) => {
          this.orderCustom.meals.push(meal);
        },
        (_error) => {
          this.dessertService.getByName(popularName).subscribe(
            (dessert: Dessert) => {
              this.orderCustom.desserts.push(dessert);
            }
          )
        });
      this.selectedPopularNames.push(popularName);
      this.orderCustom.totalPrice += price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectMeal(meal: Meal): void {
    const isMealExistsInOrder = this.orderCustom.meals.includes(meal);

    if (isMealExistsInOrder) {
      // Deselect the meal
      this.orderCustom.meals = this.orderCustom.meals
        .filter(m => m !== meal);

      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= meal.price) {
        this.orderCustom.totalPrice -= meal.price;
      }
    } else {
      // Select a new meal
      this.orderCustom.meals.push(meal);
      this.orderCustom.totalPrice += meal.price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public selectDessert(dessert: Dessert): void {
    const isDessertExistsInOrder = this.orderCustom.desserts.includes(dessert);

    if (isDessertExistsInOrder) {
      // Deselect the dessert
      this.orderCustom.desserts = this.orderCustom.desserts
        .filter(dsrt => dsrt !== dessert);

      if (this.orderCustom.totalPrice != null && this.orderCustom.totalPrice >= dessert.price) {
        this.orderCustom.totalPrice -= dessert.price;
      }
    } else {
      // Select a new dessert
      this.orderCustom.desserts.push(dessert);
      this.orderCustom.totalPrice += dessert.price;
    }
    console.log('Current custom Order:', this.orderCustom);
  }

  public submitOrder(): void {
    console.log('Order submitted:', this.orderCustom);
    this.order.drinks = this.orderCustom.drinks;
    this.order.iceCubes = true;
    this.order.lemon = true;
    this.order.meals = this.orderCustom.meals;
    this.order.desserts = this.orderCustom.desserts;
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
    this.drinkService.findAll(this.drinkCurrentPage, this.drinkPageSize).subscribe( 
      response => {
        this.drinks = response.content;
        this.drinkTotalElements = response.totalElements;
        this.drinkTotalPages = response.totalPages;
        console.log('drinks: ', response);
      },
      error => {
        alert(error.message);
      } 
    );
  }

  public onDrinkPageChange(page: number): void {
    this.drinkCurrentPage = page;
    this.findAllDrinks();
  }

  public onDrinkPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.drinkPageSize = parseInt(selectElement.value, 10);
    this.findAllDrinks();
  }

  public findAllDesserts(): void {
    this.dessertService.findAll(this.dessertCurrentPage, this.dessertPageSize).subscribe( 
      response => {
        this.desserts = response.content;
        this.dessertTotalElements = response.totalElements;
        this.dessertTotalPages = response.totalPages;
        console.log('desserts: ', response);
      },
      error => {
        alert(error.message);
      } 
    );
  }

  public onDessertPageChange(page: number): void {
    this.dessertCurrentPage = page;
    this.findAllDesserts();
  }

  public onDessertPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.dessertPageSize = parseInt(selectElement.value, 10);
    this.findAllDesserts();
  }

  public findAllMeals(): void {
    this.mealService.findAll(this.mealCurrentPage, this.mealPageSize).subscribe( 
      response => {
        this.meals = response.content;
        this.mealTotalElements = response.totalElements;
        this.mealTotalPages = response.totalPages;
      },
      error => {
        alert(error.message);
      } 
    );
  }

  public onMealPageChange(page: number): void {
    this.mealCurrentPage = page;
    this.findAllMeals();
  }

  public onMealPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mealPageSize = parseInt(selectElement.value, 10);
    this.findAllMeals();
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
