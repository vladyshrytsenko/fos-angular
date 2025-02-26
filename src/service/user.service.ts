import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { User } from '../model/user';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient, 
    private storageService: StorageService,
    private oauthService: OAuthService
  ) { }

  public getUserById(id: number) : Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User>(`${environment.gatewayUrl}/api/auth/users/${id}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  } 

  public getByUsername(username: string) : Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User>(`${environment.gatewayUrl}/api/auth/users/username/${username}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  } 

  public getByEmail(email: string) : Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User>(`${environment.gatewayUrl}/api/auth/users/email/${email}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public getByRole(role: string) : Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User>(`${environment.gatewayUrl}/api/auth/users/role/${role}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  } 

  public findAll() : Observable<User[]> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User[]>(`${environment.gatewayUrl}/api/auth/users`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  } 

  public register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.gatewayUrl}/api/auth/users/auth/register`, user);
  }

  public updateUser(id: number, user: User) : Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.put<User>(`${environment.gatewayUrl}/api/auth/users/${id}`, user, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  } 

  public deleteUserById(id: number) : Observable<void> {
    const token = this.storageService.getJwtToken();

    return this.http.delete<void>(`${environment.gatewayUrl}/api/auth/users/${id}`, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public isAdmin(): boolean {
    const token = this.storageService.getJwtToken()!;
  
      if (token != null) {
        const payload = this.decodeToken(token);
        if (payload || payload.role) {
          if (payload.role === 'ADMIN') {
            return true;
          }
        }
      }
      return false;
  }

  public getCurrentUser(): Observable<User> {
    const token = this.storageService.getJwtToken();

    return this.http.get<User>(`${environment.gatewayUrl}/api/auth/users/current-user`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
