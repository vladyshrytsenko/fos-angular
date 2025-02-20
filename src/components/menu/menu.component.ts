import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';
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
import { User } from '../../model/user';
import { Modal } from 'bootstrap';

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
  public selectedDrinkName: string | null = null;
  public isDrinkSelected: boolean = false;

  public desserts!: Dessert[];
  public selectedDessertName: string | null = null;
  public isDessertSelected: boolean = false;

  public meals!: Meal[];
  public selectedMealName: string | null = null;
  public isMealSelected: boolean = false;

  cuisines: Cuisine[] = [];
  selectedCuisine!: Cuisine;

  public order: Order = {
    id: 0,
    createdAt: new Date(),
    createdBy: 1,
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
    private userService: UserService,
    private router: Router,
    private el: ElementRef, 
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // this.findAllDrinks();
    // this.findAllDesserts();
    // this.findAllMeals();

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
    this.order.iceCubes = true;
    this.order.lemon = true;
    this.order.mealName = this.orderCustom.mealName ?? null;
    this.order.dessertName = this.orderCustom.dessertName ?? null;
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
