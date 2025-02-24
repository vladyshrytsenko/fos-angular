import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Cuisine } from "../model/cuisine";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
  })
  
  export class CuisineService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Cuisine> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Cuisine>(`${this.apiServerUrl}/api/cuisines/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public findAll() : Observable<Cuisine[]> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Cuisine[]>(`${this.apiServerUrl}/api/cuisines`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public create(cuisine: Cuisine) : Observable<Cuisine> {
      const token = this.storageService.getJwtToken();

      return this.http.post<Cuisine>(`${this.apiServerUrl}/api/cuisines`, cuisine, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }

    public updateById(id: number, cuisine: Cuisine) : Observable<Cuisine> {
      const token = this.storageService.getJwtToken();

      return this.http.put<Cuisine>(`${this.apiServerUrl}/api/cuisines/${id}`, cuisine, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public deleteById(id: number) : Observable<void> {
      const token = this.storageService.getJwtToken();

      return this.http.delete<void>(`${this.apiServerUrl}/api/cuisines/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  }
