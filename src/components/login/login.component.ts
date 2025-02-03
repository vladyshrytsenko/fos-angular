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
  registerForm!: FormGroup;
  confirmPassword: string = '';
  user!: User;

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    (window as any).handleCredentialResponse = (response: any) => {
      console.log('Encoded JWT ID token: ' + response.credential);
      this.authService.verifyGoogleToken(response.credential).subscribe(
        (data) => {
          console.log('Google login successful:', data);
          this.storageService.setItem('jwtToken', data.token);
          this.router.navigate(['/menu']);
        },
        (error) => {
          console.error('Google login failed:', error.message);
        }
      );
    };

    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get('code');
    if (githubCode) {
      this.authService.verifyGitHubToken(githubCode).subscribe(
        (data) => {
          console.log('GitHub login successful:', data);
          this.storageService.setItem('jwtToken', data.token);
          this.router.navigate(['/menu']);
        },
        (error) => console.error('GitHub login failed:', error.message)
      );
    };
  }

  public loginWithGithub(): void {
    window.location.href = 'http://localhost:9000/api/users/auth/github';
  }

  public onAuthenticate(loginForm: NgForm): void {
    console.log('entry point onAuthenticate')

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

  public onRegister(registerForm: NgForm) : void {
    console.log('entry point onRegister')

    if (registerForm.valid && this.confirmPassword === registerForm.value.password) {
      this.userService.register(registerForm.value).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);  
        },
        (error: HttpErrorResponse) => {
          alert(error.message)
        }
      )
    } else {
      alert('Passwords do not match');
    }
  }
}
