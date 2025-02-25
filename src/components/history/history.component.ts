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

  constructor(
    private orderService: OrderService,
    private router: Router, 
    private userService: UserService,
    private subscriptionService: SubscriptionService
  ) {}

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
    this.orderService.findAll().subscribe( 
      (response: Order[]) => {
        this.orders = response
        .sort((a, b) => b.id - a.id)
        .map(order => ({
          ...order,
          dessertNames: order.desserts?.map(dessert => dessert.name) || [],
          drinkNames: order.drinks?.map(drink => drink.name) || [],
          mealNames: order.meals?.map(meal => meal.name) || []
        }));
  
        console.log('orders: ', this.orders);
      },
      error => {
        alert(error.message);
      } 
    );
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
