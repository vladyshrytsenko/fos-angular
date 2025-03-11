import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public user!: User;
  public admin!: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        if (event.url !== '/login') {
          this.initAuth();
        }
      });
  }

  private initAuth(): void {
    this.authService.loginCallback().subscribe({
      next: () => {
        this.admin = this.userService.isAdmin();

        this.userService.getCurrentUser().subscribe(
          (response: User) => {
            this.user = response;
          },
          error => {
            console.error('Error getting current user:', error);
            this.admin = false;
          }
        );
      },
      error: (err) => {
        console.error('Error in loginCallback:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  public onLogout(): void {
    console.log('entry point onLogout')
    this.authService.logout();
    this.router.navigate(['/login']);

    console.log('Successfully logged out')
  }

}
