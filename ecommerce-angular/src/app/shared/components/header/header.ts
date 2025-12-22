import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Theme, ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  readonly isAuthenticated$: Observable<boolean>;
  readonly username$: Observable<string | null>;
  readonly theme$: Observable<Theme>;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
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
