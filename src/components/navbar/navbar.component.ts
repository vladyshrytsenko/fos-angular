import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../service/storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';

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
    private storageService: StorageService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.isAdmin().subscribe(
      (isAdmin: boolean) => {
        this.admin = isAdmin;
      },
      error => {
        console.error('Error checking admin status:', error);
        this.admin = false;
      }
    );
    this.userService.getCurrentUser().subscribe(
      (response: User) => {
        this.user = response;
      },
      error => {
        console.error('Error getting current user:', error);
        this.admin = false;
      }
    );
  }

  public onLogout() : void {
    console.log('entry point onLogout')

    this.storageService.removeJwtToken();
    this.router.navigate(['/login']);

    console.log('Successfully logged out')
  }

}
