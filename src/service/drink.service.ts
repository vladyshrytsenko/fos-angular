import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Drink } from "../model/drink";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
  })
  
  export class DrinkService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Drink> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Drink>(`${this.apiServerUrl}/api/drinks/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public findAll() : Observable<Drink[]> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Drink[]>(`${this.apiServerUrl}/api/drinks`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public create(drink: Drink) : Observable<Drink> {
      const token = this.storageService.getJwtToken();

      return this.http.post<Drink>(`${this.apiServerUrl}/api/drinks`, drink, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }

    public updateById(id: number, drink: Drink) : Observable<Drink> {
      const token = this.storageService.getJwtToken();

      return this.http.put<Drink>(`${this.apiServerUrl}/api/drinks/${id}`, drink, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public deleteById(id: number) : Observable<void> {
      const token = this.storageService.getJwtToken();

      return this.http.delete<void>(`${this.apiServerUrl}/api/drinks/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  }
