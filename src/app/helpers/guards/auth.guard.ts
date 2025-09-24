// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    
    const userType = localStorage.getItem('userType')

    const expectedRole = route.data['expectedRole'];

    if (expectedRole === 'user' && userType === 'user') {
      return true;
    }

    if (expectedRole === 'vendor' && userType === 'vendor') {
      return true;
    }

    // Redirect to login or unauthorized page
    this.router.navigate(['/index']);
    return false;
  }
}
