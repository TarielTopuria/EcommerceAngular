import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const adminUsernames = new Set((environment as any)?.adminUsernames ?? []);
    const username = this.authService.username;

    if (typeof username === 'string' && adminUsernames.has(username)) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
