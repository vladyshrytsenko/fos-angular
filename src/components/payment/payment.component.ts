import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { loadStripe } from '@stripe/stripe-js';

declare const Stripe: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentComponent {
  stripe: any;
  elements: any;
  paymentElement: any;
  loading = false;
  message: string | null = null;
  uuid = 'your-payment-uuid';
  private isPaymentInitialized = false;

  async initializeStripe() {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublishableKey);
      if (!this.stripe) {
        console.error('Failed to load Stripe.js');
        return;
      }
      console.log('Stripe.js successfully loaded');
    }
  }

  // ngOnInit(): void {
  //     loadStripe(environment.stripePublishableKey).then((stripe) => {
  //       if (!stripe) {
  //         console.log('Failed to load Stripe.js');
  //         return;
  //       } else {
  //         console.log('Stripe.js successfully loaded');
  //       }
  //       this.stripe = stripe;
  //       if (!this.paymentElement) {
  //         this.initializePaymentElement();
  //       }
  //     });
  // }

  async initializePaymentElement() {
    await this.initializeStripe();

    if (!this.paymentElement) {
      try {
        const { clientSecret } = await this.fetchPaymentIntent();
        console.log('Payment Intent Client Secret:', clientSecret);

        const appearance = { theme: 'stripe' };
        this.elements = this.stripe.elements({ clientSecret, appearance });

        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');
        console.log('Payment Element successfully mounted');
      } catch (error) {
        console.error('Error initializing Payment Element:', error);
      }
    }
  }

  async fetchPaymentIntent() {
    const response = await fetch('http://localhost:8080/api/payments/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000, currency: 'usd' })
    });
    const data = await response.json();
    return data;
  }

  async submitPayment() {
    this.loading = true;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      this.message = error.message;
    } else {
      this.message = 'Payment succeeded!';
    }
    this.loading = false;
  }
}
