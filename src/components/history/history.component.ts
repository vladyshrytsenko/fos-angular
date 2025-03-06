import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { OrderService } from '../../service/order.service';
import { Order } from '../../model/order';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../service/subscription.service';
import { Subscription } from '../../model/subscription';
import { User } from '../../model/user';
import { Dessert } from '../../model/dessert';
import { Drink } from '../../model/drink';
import { Meal } from '../../model/meal';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  public orders!: Order[];
  public admin!: boolean;
  subscriptionOptions: string[] = ['DAILY', 'WEEKLY', 'MONTHLY'];

  public currentPage = 0;
  public pageSize = 5;
  public totalPages = 0;
  public totalOrders = 0;
  public pagesArray: number[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private userService: UserService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.admin = this.userService.isAdmin();
    this.findAllOrders();
  }

  onSubscriptionChange(orderId: number, selectedValue: string) {
    console.log('Selected subscription:', selectedValue);

    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        const subscription: Subscription = {
          type: selectedValue,
          userId: user.id,
          orderId: orderId
        };

        this.subscriptionService.create(subscription).subscribe({
          next: (createdSubscription) => {
            console.log('Subscription created:', createdSubscription);
          },
          error: (err) => {
            console.error('Error creating subscription:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching current user:', err);
      }
    });

  }
  
  public findAllOrders(): void {
    this.orderService.findAll(this.currentPage, this.pageSize).subscribe(
      response => {
        this.orders = response.content
        .map((order: { desserts: Dessert[], drinks: Drink[], meals: Meal[] }) => ({
          ...order,
          dessertNames: order.desserts
            .map(dessert => dessert.name) || [],
          drinkNames: order.drinks
            .map(drink => drink.name) || [],
          mealNames: order.meals
            .map(meal => meal.name) || []
        })) || [];
  
        this.totalOrders = response?.totalElements || 0;
        this.totalPages = response?.totalPages || 0;
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
  
        console.log('Orders:', this.orders);
      },
      error => {
        alert(error.message);
      }
    );
  }

  public onChangePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.findAllOrders();
    }
  }

  public onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = parseInt(selectElement.value, 10);
    this.findAllOrders();
  }

  getDessertTotalPrice(order: Order): number {
    let totalPrice = 0;
    order.desserts?.forEach(dessert => {
      totalPrice += dessert.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  getDrinkTotalPrice(order: Order): number {
    let totalPrice = 0;
    order.drinks?.forEach(drink => {
      totalPrice += drink.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  getMealTotalPrice(order: Order): number {
    let totalPrice = 0;
    order.meals?.forEach(meal => {
      totalPrice += meal.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  getTotalPrice(order: Order): number {
    const mealPrice = this.getMealTotalPrice(order);
    const dessertPrice = this.getDessertTotalPrice(order);
    const drinkPrice = this.getDrinkTotalPrice(order);

    const totalPrice = mealPrice + dessertPrice + drinkPrice;
    return parseFloat(totalPrice.toFixed(2));
  }
}
