import { CommonModule, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, JsonPipe, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'test-project';

  public user: User | undefined;
  public users: User[] | undefined;
  public testData: any;
  showNavbar: boolean = true;

  constructor(private router: Router, private userService: UserService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !(this.router.url === '/login' || this.router.url === '/404');
      }
    });
  }

  ngOnInit(): void {

  }

  public getUserById(id: number): void {
    this.userService.getUserById(id).subscribe( 
      (response: User) => {
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      } 
    );
  }

  public findUsers(): void {
    this.userService.findAll().subscribe( 
      (response: User[]) => {
        this.users = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      } 
    );
  }

  public registerUser(user: User): void {
    this.userService.register(user).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public updateUser(id: number, user: User): void {
    this.userService.updateUser(id, user).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public deleteUserById(id: number): void {
    this.userService.deleteUserById(id).subscribe(
      (response) => {
        console.log('User deleted successfully');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}

