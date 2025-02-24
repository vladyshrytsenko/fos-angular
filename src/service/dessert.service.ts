import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Dessert } from "../model/dessert";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
  })
  
  export class DessertService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }
  
    public getById(id: number) : Observable<Dessert> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Dessert>(`${this.apiServerUrl}/api/desserts/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public getByName(name: string) : Observable<Dessert> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Dessert>(`${this.apiServerUrl}/api/desserts/searchBy?name=${name}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 

    public findAll() : Observable<Dessert[]> {
      const token = this.storageService.getJwtToken();

      return this.http.get<Dessert[]>(`${this.apiServerUrl}/api/desserts`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public create(dessert: Dessert) : Observable<Dessert> {
      const token = this.storageService.getJwtToken();

      return this.http.post<Dessert>(`${this.apiServerUrl}/api/desserts`, dessert, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }

    public updateById(id: number, dessert: Dessert) : Observable<Dessert> {
      const token = this.storageService.getJwtToken();

      return this.http.put<Dessert>(`${this.apiServerUrl}/api/desserts/${id}`, dessert, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  
    public deleteById(id: number) : Observable<void> {
      const token = this.storageService.getJwtToken();

      return this.http.delete<void>(`${this.apiServerUrl}/api/desserts/${id}`, { 
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    } 
  }
