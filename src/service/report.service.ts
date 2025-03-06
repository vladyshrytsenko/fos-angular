import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  generateReport(): Observable<Blob> {
    const token = this.storageService.getJwtToken();

    return this.http.post<Blob>(`${environment.gatewayUrl}/api/core/reports`, null, {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
