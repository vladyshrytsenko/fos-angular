import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule, withFetch } from '@angular/common/http';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AuthGuard } from '../login/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PaymentSuccessComponent } from '../payment-success/payment-success.component';

export const routes: Routes = [
    { 
      path: 'login', 
      loadComponent: () => import('../login/login.component').then(m => m.LoginComponent) 
    },
    { 
      path: 'menu', 
      loadComponent: () => import('../menu/menu.component').then(m => m.MenuComponent),
      canActivate: [AuthGuard]
    },
    { 
      path: 'payment-success', 
      component: PaymentSuccessComponent 
    },
    { 
      path: 'history', 
      loadComponent: () => import('../history/history.component').then(m => m.HistoryComponent)
    },
    { 
      path: 'payment/:id', 
      loadComponent: () => import('../payment/payment.component').then(m => m.PaymentComponent) 
    },
    { 
      path: '', 
      redirectTo: 'menu', 
      pathMatch: 'full' 
    },
    { 
      path: '404', 
      component: NotFoundComponent 
    },
    { 
      path: '**', 
      redirectTo: "/404" 
    } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }