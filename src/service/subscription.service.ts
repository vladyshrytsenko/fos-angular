import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Subscription } from "../model/subscription";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public create(subscription: Subscription): Observable<Subscription> {
    const token = this.storageService.getJwtToken();

    return this.http.post<Subscription>(`${environment.gatewayUrl}/api/core/subscriptions`, subscription, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
