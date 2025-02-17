import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { StorageService } from '../../service/storage.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('registrationModal') registrationModal!: ElementRef;
  confirmPassword: string = '';

  private clientId = 'qwerty123qwerty123';
  private authServerUrl = 'http://localhost:9000/oauth2/authorize';
  private tokenUrl = 'http://localhost:9000/oauth2/token';
  private redirectUri = 'http://localhost:4200/menu';

  constructor(
    private userService: UserService, 
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.handleOAuthCallback();
  }

  public onAuthenticate(loginForm: NgForm): void {
    console.log('entry point onAuthenticate');

    const email = loginForm.value.email;
    const password = loginForm.value.password;

    this.userService.login(email, password).subscribe(
      data => {
        this.storageService.setItem('jwtToken', data.token);
        console.log('User signed in successfully. token: ', data.token);
        this.router.navigate(['/menu']);
      },
      error => {
        console.log('Login failed!', error.message);
      }
    );
  }

  public onRegister(registerForm: NgForm): void {
    console.log('entry point onRegister');

    if (registerForm.valid && this.confirmPassword === registerForm.value.password) {
      this.userService.register(registerForm.value).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);  
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      alert('Passwords do not match');
    }
  }

  /** Login via Spring Authorization Server */
  public loginWithOAuth2(): void {
    const authorizationUrl = `${this.authServerUrl}?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=openid profile`;
    window.location.href = authorizationUrl;
  }

  private handleOAuthCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      this.exchangeCodeForToken(authCode);
    }
  }

  redirectToAuthServer() {
    window.location.href = `${this.authServerUrl}?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}`;
  }

  private exchangeCodeForToken(authCode: string): void {
    fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: 'zxcvb123'
      })
    })
    .then(response => response.json())
    .then(data => {
      this.storageService.setItem('jwtToken', data.access_token);
      this.router.navigate(['/menu']);
    })
    .catch(error => console.error('OAuth2 login failed:', error));
  }
}
