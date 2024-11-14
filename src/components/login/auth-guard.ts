import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "../../service/user.service";
import { StorageService } from "../../service/storage.service";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
  
    constructor(
      private userService: UserService, 
      private router: Router,
      private storateService: StorageService
    ) {}
  
    canActivate(): boolean {
      const token = this.storateService.getJwtToken();

      if (token) {
        if (this.isTokenExpired(token)) {
          this.storateService.removeJwtToken();

          this.router.navigate(['/login']);
          return false;
        }

        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    private isTokenExpired(token: string): boolean {
      const payload = this.userService.decodeToken(token);
      if (!payload || !payload.exp) {
        return true;
      }
  
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    }


  }
