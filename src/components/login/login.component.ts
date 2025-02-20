import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { StorageService } from '../../service/storage.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('registrationModal') registrationModal!: ElementRef;
  confirmPassword: string = '';

  private clientId = 'qwerty123qwerty123';
  private authServerUrl = 'http://localhost:9000/oauth2/authorize';
  private tokenUrl = 'http://localhost:9000/oauth2/token';
  private redirectUri = 'http://localhost:4200/';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService, 
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  public onAuthenticate(): void {
    this.authService.login();
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

  redirectToAuthServer() {
    window.location.href = `${this.authServerUrl}?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}`;
  }
}
