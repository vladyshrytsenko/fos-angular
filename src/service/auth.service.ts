import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../model/authResponse";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    private apiUrl = 'http://localhost:9000/api/users';
    private redirectUri = 'http://localhost:4200/auth-callback';
    private tokenUrl = 'http://localhost:9000/oauth2/token';
    private clientId = 'client';
    private clientSecret = 'secret';
    private authServerUrl = 'http://localhost:9000/oauth2/authorize';

    constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router
    ) {}

    private authState = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.authState.asObservable();
  
    setAuthCompleted() {
      this.authState.next(true);
    }
  
    logout() {
      this.authState.next(false);
    }

    public login() {
      const clientId = 'client';
      const redirectUri = encodeURIComponent(`${this.redirectUri}`);
      const scope = 'openid profile';
      const authUrl = `http://localhost:9000/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
      window.location.href = authUrl;
    }
  }
