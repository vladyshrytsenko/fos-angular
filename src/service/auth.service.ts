import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../model/authResponse";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    private apiUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) {}

    verifyGoogleToken(token: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/auth/google`, { token });
    }
  }