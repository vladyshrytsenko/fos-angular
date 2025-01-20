import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Subscription } from "../model/subscription";

@Injectable({
    providedIn: 'root'
  })
  
  export class SubscriptionService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(private http: HttpClient) { }
  
    public create(subscription: Subscription) : Observable<Subscription> {
      return this.http.post<Subscription>(`${this.apiServerUrl}/api/subscriptions`, subscription);
    }
  
  }