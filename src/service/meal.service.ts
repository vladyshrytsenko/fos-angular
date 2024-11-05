import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Meal } from "../model/meal";

@Injectable({
    providedIn: 'root'
  })
  
  export class MealService {
    private apiServerUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    public getById(id: number) : Observable<Meal> {
      return this.http.get<Meal>(`${this.apiServerUrl}/api/meals/${id}`);
    } 

    public findAll() : Observable<Meal[]> {
        return this.http.get<Meal[]>(`${this.apiServerUrl}/api/meals`);
    } 
  
    public create(meal: Meal) : Observable<Meal> {
      return this.http.post<Meal>(`${this.apiServerUrl}/api/meals`, meal);
    }

    public updateById(id: number, meal: Meal) : Observable<Meal> {
        return this.http.put<Meal>(`${this.apiServerUrl}/api/meals/${id}`, meal);
      } 
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/meals/${id}`);
    } 
  
  }