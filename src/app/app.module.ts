import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GamesComponent } from './games/games.component';
import { GameSearchComponent } from './game-search/game-search.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        GamesComponent,
        GameDetailComponent,
        MessagesComponent,
        GameSearchComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
