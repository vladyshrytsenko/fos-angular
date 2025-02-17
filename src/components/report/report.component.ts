import { Component } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from '../../service/report.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) {}

  generateReport() {
    this.reportService.generateReport().subscribe(
      (report: Blob) => {
        const pdfUrl = URL.createObjectURL(report);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      },
      error => {
        console.error('An error occured while generating a report', error);
      }
    );
  }

}
