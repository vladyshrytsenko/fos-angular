import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class PopularDishesService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  public findAll(): Observable<Map<string, string[]>> {
    const token = this.storageService.getJwtToken();

    return this.http.get<Map<string, string[]>>(`${environment.gatewayUrl}/api/core/popular`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
