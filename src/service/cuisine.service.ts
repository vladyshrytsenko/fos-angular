import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Cuisine } from "../model/cuisine";

@Injectable({
    providedIn: 'root'
  })
  
  export class CuisineService {
    private apiServerUrl = environment.apiBaseUrl;
  
    constructor(private http: HttpClient) { }
  
    public getById(id: number) : Observable<Cuisine> {
      return this.http.get<Cuisine>(`${this.apiServerUrl}/api/cuisines/${id}`);
    } 

    public findAll() : Observable<Cuisine[]> {
        return this.http.get<Cuisine[]>(`${this.apiServerUrl}/api/cuisines`);
    } 
  
    public create(cuisine: Cuisine) : Observable<Cuisine> {
      return this.http.post<Cuisine>(`${this.apiServerUrl}/api/cuisines`, cuisine);
    }

    public updateById(id: number, cuisine: Cuisine) : Observable<Cuisine> {
        return this.http.put<Cuisine>(`${this.apiServerUrl}/api/cuisines/${id}`, cuisine);
      } 
  
    public deleteById(id: number) : Observable<void> {
      return this.http.delete<void>(`${this.apiServerUrl}/api/cuisines/${id}`);
    } 
  
  }