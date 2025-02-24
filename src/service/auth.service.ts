import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageService } from "./storage.service";
import { OAuthService } from "angular-oauth2-oidc";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    // private apiUrl = 'http://localhost:9000/api/users';
    private apiServerUrl = environment.apiAuthUrl;
    private redirectUri = 'http://localhost:4200/auth-callback';
    // private tokenUrl = 'http://localhost:9000/oauth2/token';
    private clientId = 'client';
    private clientSecret = 'secret';
    private authServerUrl = 'http://localhost:9000/oauth2/authorize';

    constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router,
      private storageService: StorageService,
      private oauthService: OAuthService

    ) {}

    public login() {
      const clientId = 'client';
      const redirectUri = encodeURIComponent(`${this.redirectUri}`);
      const scope = 'openid profile';
      const authUrl = `${this.authServerUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
      window.location.href = authUrl;
    }

    logout(): void {
      const logoutUrl = `${this.apiServerUrl}/logout`;
      const redirectUrl = 'http://localhost:4200/login';
  
      this.http.post(logoutUrl, {}, { withCredentials: true }).subscribe({
        next: () => {
          this.storageService.removeJwtToken();
          this.clearCookies();
          window.location.href = redirectUrl;
        },
        error: () => console.error('Logout failed')
      });
    }

    public loginCallback(): void {    
      this.route.queryParamMap.subscribe((params) => {    
        const code = params.get('code');
    
        if (code) {
          this.exchangeCodeForToken(code).subscribe({
            next: () => {
              console.log('Token received, navigating to /menu');
              this.router.navigate(['/menu']);
            },
            error: (err) => {
              this.router.navigate(['/login']);
            }
          });
        }
      });
    }

    private exchangeCodeForToken(authCode: string) {
      const tokenUrl = `${this.apiServerUrl}/oauth2/token`;
    
      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('code', authCode);
      body.set('client_id', this.clientId);
      body.set('redirect_uri', this.redirectUri);

      const encryptedCredentials = btoa(`${this.clientId}:${this.clientSecret}`);

      const headers: any = { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encryptedCredentials}`
      };

      return this.http.post(tokenUrl, body.toString(), { headers, withCredentials: true })
        .pipe(
          tap((res: any) => {
            this.storageService.setItem('jwtToken', res.access_token);
          })
        );
    }

    private clearCookies() {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  }
