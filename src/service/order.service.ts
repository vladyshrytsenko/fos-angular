import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Order } from "../model/order";

@Injectable({
    providedIn: 'root'
  })
  
  export class OrderService {
    private apiServerUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    public getById(id: number) : Observable<Order> {
      return this.http.get<Order>(`${this.apiServerUrl}/api/orders/${id}`);
    } 

    public findAll() : Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiServerUrl}/api/orders`);
    } 
  
    public create(order: Order) : Observable<Order> {
      return this.http.post<Order>(`${this.apiServerUrl}/api/orders`, order);
    }
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/orders/${id}`);
    } 
  
  }