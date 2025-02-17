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
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Order> {
      return this.http.get<Order>(`${this.apiServerUrl}/api/orders/${id}`);
    } 

    public findAll() : Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiServerUrl}/api/orders`);
    } 
  
    public create(order: Order) : Observable<Order> {
      const token = this.storageService.getJwtToken();
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`);

    return this.http.post<Order>(`${this.apiServerUrl}/api/orders`, order, { headers });
    }
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/orders/${id}`);
    } 
  
  }