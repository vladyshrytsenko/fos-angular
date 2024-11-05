import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Drink } from "../model/drink";

@Injectable({
    providedIn: 'root'
  })
  
  export class DrinkService {
    private apiServerUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    public getById(id: number) : Observable<Drink> {
      return this.http.get<Drink>(`${this.apiServerUrl}/api/drinks/${id}`);
    } 

    public findAll() : Observable<Drink[]> {
        return this.http.get<Drink[]>(`${this.apiServerUrl}/api/drinks`);
    } 
  
    public create(drink: Drink) : Observable<Drink> {
      return this.http.post<Drink>(`${this.apiServerUrl}/api/drinks`, drink);
    }

    public updateById(id: number, drink: Drink) : Observable<Drink> {
        return this.http.put<Drink>(`${this.apiServerUrl}/api/drinks/${id}`, drink);
      } 
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/drinks/${id}`);
    } 
  
  }