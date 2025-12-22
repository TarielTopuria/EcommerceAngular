import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'ecommerce.theme.v1';
  private readonly subject = new BehaviorSubject<Theme>(this.readInitialTheme());

  readonly theme$: Observable<Theme> = this.subject.asObservable();

  constructor() {
    this.applyTheme(this.subject.value);
  }

  get theme(): Theme {
    return this.subject.value;
  }

  setTheme(theme: Theme): void {
    if (theme === this.subject.value) return;
    this.subject.next(theme);
    this.persist(theme);
    this.applyTheme(theme);
  }

  toggle(): void {
    this.setTheme(this.subject.value === 'dark' ? 'light' : 'dark');
  }

  private readInitialTheme(): Theme {
    if (typeof window === 'undefined' || !window.localStorage) return 'light';

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw === 'dark' || raw === 'light') return raw;
    } catch {
    }

    return 'light';
  }

  private persist(theme: Theme): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      window.localStorage.setItem(this.storageKey, theme);
    } catch {
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }
}
