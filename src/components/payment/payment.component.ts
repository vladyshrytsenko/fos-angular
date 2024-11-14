// payment.component.ts
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'; // Add your Stripe key here
import { CommonModule } from '@angular/common';

declare const Stripe: any;

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
  uuid = 'your-payment-uuid';

  ngOnInit(): void {
    this.stripe = Stripe(environment.stripePublishableKey);
    this.initializePaymentElement();
  }

  async initializePaymentElement() {
    const { clientSecret } = await this.fetchPaymentIntent();

    const appearance = { theme: 'stripe' };
    this.elements = this.stripe.elements({ clientSecret, appearance });

    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount('#payment-element');
  }

  async fetchPaymentIntent() {
    // Call your backend to create and return a Payment Intent
    const response = await fetch('/menu', { method: 'GET' });
    return await response.json();
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
