import { Component, signal } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('ecommerce-angular');

  constructor(_: ThemeService) {}
}
