import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ScoreListComponent } from './score-list/score-list.component';
import { GameListComponent } from './game-list/game-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TeamStatsComponent } from './team-stats/team-stats.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ScoreListComponent,
    GameListComponent,
    TeamStatsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
  ]
})
export class DashboardModule { }
