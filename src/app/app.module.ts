import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarModule } from './features/nav-bar/nav-bar.module';

@NgModule({
    imports: [
      BrowserModule, 
      FormsModule, 
      AppRoutingModule, 
      HttpClientModule, 
      BrowserAnimationsModule,
      NavBarModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
