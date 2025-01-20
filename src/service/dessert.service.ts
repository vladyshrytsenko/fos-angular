import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Dessert } from "../model/dessert";

@Injectable({
    providedIn: 'root'
  })
  
  export class DessertService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(private http: HttpClient) { }
  
    public getById(id: number) : Observable<Dessert> {
      return this.http.get<Dessert>(`${this.apiServerUrl}/api/desserts/${id}`);
    } 

    public findAll() : Observable<Dessert[]> {
        return this.http.get<Dessert[]>(`${this.apiServerUrl}/api/desserts`);
    } 
  
    public create(dessert: Dessert) : Observable<Dessert> {
      return this.http.post<Dessert>(`${this.apiServerUrl}/api/desserts`, dessert);
    }

    public updateById(id: number, dessert: Dessert) : Observable<Dessert> {
        return this.http.put<Dessert>(`${this.apiServerUrl}/api/desserts/${id}`, dessert);
      } 
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/desserts/${id}`);
    } 
  
  }