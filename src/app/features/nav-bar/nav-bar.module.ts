import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';

import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar'

import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    DashboardRoutingModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
