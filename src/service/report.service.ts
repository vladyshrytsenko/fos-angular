import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class ReportService {
    private apiServerUrl = environment.apiCoreUrl;
  
    constructor(private http: HttpClient) {}
  
    generateReport(): Observable<Blob> {
        return this.http.post<Blob>(`${this.apiServerUrl}/api/reports`, null, {
          responseType: 'blob' as 'json'
        });
      }
  }
