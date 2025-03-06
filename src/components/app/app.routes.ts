import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, withFetch } from '@angular/common/http';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AuthGuard } from '../login/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PaymentSuccessComponent } from '../payment-success/payment-success.component';
import { SafePipe } from '../report/pipes/safe.pipe';
import { JwtInterceptor } from '../login/jwt-interceptor';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth-callback',
    loadComponent: () => import('../navbar/navbar.component').then(m => m.NavbarComponent)
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
    loadComponent: () => import('../history/history.component').then(m => m.HistoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadComponent: () => import('../report/report.component').then(m => m.ReportComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:id',
    loadComponent: () => import('../payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [AuthGuard]
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
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    SafePipe
  ]
})
export class AppRoutingModule { }
