import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
// import { NotFoundComponent } from '../not-found/not-found.component';
// import { AuthGuard } from '../login/auth-guard';
import { HttpClientModule, withFetch } from '@angular/common/http';

export const routes: Routes = [
    // { 
    //   path: 'login', 
    //   loadComponent: () => import('../login/login.component').then(m => m.LoginComponent) 
    // },
    { 
      path: 'menu', 
      loadComponent: () => import('../menu/menu.component').then(m => m.MenuComponent)
    },
    { 
      path: 'payment/:id', 
      loadComponent: () => import('../payment/payment.component').then(m => m.PaymentComponent) 
    },
    { 
      path: '', 
      redirectTo: 'menu', 
      pathMatch: 'full' 
    }
    // { 
    //   path: '404', 
    //   component: NotFoundComponent 
    // },
    // { 
    //   path: '**', 
    //   redirectTo: "/404" 
    // } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
//   providers: [
//     AuthGuard
//   ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }