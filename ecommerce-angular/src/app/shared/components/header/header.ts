import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Theme, ThemeService } from '../../../core/services/theme.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  readonly isAuthenticated$: Observable<boolean>;
  readonly isAdmin$: Observable<boolean>;
  readonly username$: Observable<string | null>;
  readonly theme$: Observable<Theme>;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    const adminUsernames = new Set((environment as any)?.adminUsernames ?? []);
    this.isAdmin$ = this.authService.username$.pipe(
      map((u) => typeof u === 'string' && adminUsernames.has(u))
    );
    this.username$ = this.authService.username$;
    this.theme$ = this.themeService.theme$;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
