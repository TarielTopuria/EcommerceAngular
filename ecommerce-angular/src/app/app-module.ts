import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Layout } from './layout/layout/layout';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { HomePage } from './pages/home-page/home-page';

@NgModule({
  declarations: [
    App,
    Layout,
    Header,
    Footer,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
