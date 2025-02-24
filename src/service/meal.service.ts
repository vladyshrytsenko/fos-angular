import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Meal } from "../model/meal";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
  })
  
  export class MealService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Meal> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Meal>(`${this.apiServerUrl}/api/meals/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public getByName(name: string) : Observable<Meal> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Meal>(`${this.apiServerUrl}/api/meals/searchBy?name=${name}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public findAll() : Observable<Meal[]> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Meal[]>(`${this.apiServerUrl}/api/meals`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public create(meal: Meal) : Observable<Meal> {
      const token = this.storageService.getJwtToken();

      return this.http.post<Meal>(`${this.apiServerUrl}/api/meals`, meal, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }

    public updateById(id: number, meal: Meal) : Observable<Meal> {
      const token = this.storageService.getJwtToken();

      return this.http.put<Meal>(`${this.apiServerUrl}/api/meals/${id}`, meal, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public deleteById(id: number) : Observable<void> {
      const token = this.storageService.getJwtToken();

      return this.http.delete<void>(`${this.apiServerUrl}/api/meals/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  }
