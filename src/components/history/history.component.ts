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
    this.userService.isAdmin().subscribe(
      (isAdmin: boolean) => {
        this.admin = isAdmin;
      },
      error => {
        console.error('Error checking admin status:', error);
        this.admin = false;
      }
    );
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
        this.orders = response;
        console.log('orders: ', response);
      },
      error => {
        alert(error.message);
      } 
    );
  }

  getTotalPrice(order: any): number {
    const mealPrice = order.meal?.price ?? 0;
    const dessertPrice = order.dessert?.price ?? 0;
    const drinkPrice = order.drink?.price ?? 0;
  
    const totalPrice = mealPrice + dessertPrice + drinkPrice;
    return parseFloat(totalPrice.toFixed(2));
  }
  
}
