import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

@Component({ selector: 'app-loader', template: '', standalone: false })
class StubLoaderComponent {}

@Component({ selector: 'app-layout', template: '', standalone: false })
class StubLayoutComponent {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        App,
        StubLoaderComponent,
        StubLayoutComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the layout and loader shells', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loader')).toBeTruthy();
    expect(compiled.querySelector('app-layout')).toBeTruthy();
  });
});
