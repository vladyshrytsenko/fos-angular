import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Order } from "../model/order";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
  })
  export class OrderService {
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Order> {
      const token = this.storageService.getJwtToken();
      
      return this.http.get<Order>(`${environment.gatewayUrl}/api/core/orders/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public findAll() : Observable<Order[]> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Order[]>(`${environment.gatewayUrl}/api/core/orders`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public create(order: Order) : Observable<Order> {
      const token = this.storageService.getJwtToken();

      return this.http.post<Order>(`${environment.gatewayUrl}/api/core/orders`, order, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }
  
    public deleteById(id: number) : Observable<void> {
      const token = this.storageService.getJwtToken();

      return this.http.delete<void>(`${environment.gatewayUrl}/api/core/orders/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  }
