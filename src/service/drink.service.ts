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

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public getById(id: number): Observable<Drink> {
    const token = this.storageService.getJwtToken();

    return this.http.get<Drink>(`${environment.gatewayUrl}/api/core/drinks/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public getByName(name: string): Observable<Drink> {
    const token = this.storageService.getJwtToken();

    return this.http.get<Drink>(`${environment.gatewayUrl}/api/core/drinks/name/${name}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public findAll(page: number = 0, size: number = 10): Observable<any> {
    const token = this.storageService.getJwtToken();

    return this.http.get<any>(`${environment.gatewayUrl}/api/core/drinks`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      params: {
        page: page,
        size: size
      }
    });
  }

  public create(drink: Drink): Observable<Drink> {
    const token = this.storageService.getJwtToken();

    return this.http.post<Drink>(`${environment.gatewayUrl}/api/core/drinks`, drink, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public updateById(id: number, drink: Drink): Observable<Drink> {
    const token = this.storageService.getJwtToken();

    return this.http.put<Drink>(`${environment.gatewayUrl}/api/core/drinks/${id}`, drink, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  public deleteById(id: number): Observable<void> {
    const token = this.storageService.getJwtToken();

    return this.http.delete<void>(`${environment.gatewayUrl}/api/core/drinks/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
