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

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public getById(id: number): Observable<Meal> {
    const token = this.storageService.getJwtToken();

    return this.http.get<Meal>(`${environment.gatewayUrl}/api/core/meals/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public getByName(name: string): Observable<Meal> {
    const token = this.storageService.getJwtToken();

    return this.http.get<Meal>(`${environment.gatewayUrl}/api/core/meals/getBy?name=${name}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public findAll(page: number = 0, size: number = 10): Observable<any> {
    const token = this.storageService.getJwtToken();

    return this.http.get<any>(`${environment.gatewayUrl}/api/core/meals`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      params: {
        page: page,
        size: size
      }
    });
  }

  public create(meal: Meal): Observable<Meal> {
    const token = this.storageService.getJwtToken();

    return this.http.post<Meal>(`${environment.gatewayUrl}/api/core/meals`, meal, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public updateById(id: number, meal: Meal): Observable<Meal> {
    const token = this.storageService.getJwtToken();

    return this.http.put<Meal>(`${environment.gatewayUrl}/api/core/meals/${id}`, meal, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public deleteById(id: number): Observable<void> {
    const token = this.storageService.getJwtToken();

    return this.http.delete<void>(`${environment.gatewayUrl}/api/core/meals/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
