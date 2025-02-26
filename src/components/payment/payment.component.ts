import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  paymentElement: any;
  loading = false;
  message: string | null = null;
  totalPrice: number = 0;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadStripeAndInitialize();

    this.activatedRoute.queryParams.subscribe(params => {
      this.totalPrice = Number(params['totalPrice']);
      console.log('paymentComponent() Total Price:', this.totalPrice);
    });
  }

  async loadStripeAndInitialize() {
    try {
      const stripe = await this.loadStripe(environment.stripePublishableKey);
      if (!stripe) {
        console.error('Failed to load Stripe.js');
        return;
      }
      this.stripe = stripe;
  
      const { clientSecret } = await this.fetchPaymentIntent();
      const appearance = { theme: 'stripe' };
      this.elements = this.stripe.elements({ clientSecret, appearance });
  
      if (!this.paymentElement) {
        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');
        console.log('Payment Element successfully mounted');
      }
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }
  

  async loadStripe(publishableKey: string): Promise<any> {
    return new Promise((resolve) => {
      if (window['Stripe']) {
        resolve(window['Stripe'](publishableKey));
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
  
        script.onload = () => {
          const stripe = window['Stripe'] as any;
          if (stripe) {
            resolve(stripe(publishableKey));
          } else {
            console.error('Stripe.js was loaded, but Stripe is not available.');
            resolve(null);
          }
        };
  
        script.onerror = () => {
          console.error('Failed to load Stripe.js');
          resolve(null);
        };
  
        document.body.appendChild(script);
      }
    });
  }
  

  async fetchPaymentIntent() {
    const token = this.storageService.getJwtToken();

    const response = await fetch(`${environment.gatewayUrl}/api/core/payments/create-payment-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: this.totalPrice, currency: 'usd' })
    });
    const data = await response.json();
    return data;
  }

  async submitPayment(event: Event) {
    event.preventDefault();
  
    console.log('Entry point submitPayment()');
    this.loading = true;
  
    try {
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });
  
      if (error) {
        console.error('Payment failed:', error.message);
        this.message = error.message;
      } else {
        this.message = 'Payment succeeded!';
      }
    } catch (err) {
      console.error('Error during payment submission:', err);
    } finally {
      this.loading = false;
    }
  }
  
}
