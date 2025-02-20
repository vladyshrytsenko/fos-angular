import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, Injector, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../service/storage.service';
import { UserService } from '../../service/user.service';

import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { MenuComponent } from "../menu/menu.component";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent implements OnInit {

    private clientId = 'client';
    private clientSecret = 'secret';
    private authServerUrl = 'http://localhost:9000/oauth2/authorize';
    private tokenUrl = 'http://localhost:9000/oauth2/token';
    private redirectUri = 'http://localhost:4200/auth-callback';
  
    constructor(
      private route: ActivatedRoute,
      private userService: UserService, 
      private router: Router,
      private http: HttpClient,
      private storageService: StorageService,
      private authService: AuthService,

      private viewContainerRef: ViewContainerRef,
      private componentFactoryResolver: ComponentFactoryResolver,
      private injector: Injector
    ) {}

    ngOnInit(): void {
      console.log('AuthCallbackComponent initialized');
    
      this.route.queryParamMap.subscribe((params) => {    
        const code = params.get('code');
    
        if (code) {
          this.exchangeCodeForToken(code).subscribe({
            next: () => {
              console.log('Token received, navigating to /menu');
              // this.authService.setAuthCompleted();
              this.addNavbarDynamically();
              this.router.navigate(['/menu']);
            },
            error: (err) => {
              this.router.navigate(['/login']);
            }
          });
        }
      });
    }

    private addNavbarDynamically(): void {
      const factory = this.componentFactoryResolver.resolveComponentFactory(NavbarComponent);
      const componentRef = this.viewContainerRef.createComponent(factory, 0, this.injector);
    }

  private exchangeCodeForToken(authCode: string) {
      const tokenUrl = 'http://localhost:9000/oauth2/token';
    
      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('code', authCode);
      body.set('redirect_uri', this.redirectUri);
      body.set('client_id', this.clientId);
    
      const encryptedCredentials = btoa(`${this.clientId}:${this.clientSecret}`);

      return this.http.post(tokenUrl, body.toString(), {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${encryptedCredentials}`
        },
        withCredentials: true
      }).pipe(
        tap((res: any) => {
          localStorage.setItem('jwtToken', res.access_token);
        })
      );
    }
}
