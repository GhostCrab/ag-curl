import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorRoutingModule } from './simulator-routing.module';
import { SimulatorComponent } from './simulator.component';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    SimulatorComponent
  ],
  imports: [
    CommonModule,
    SimulatorRoutingModule,
    MatGridListModule,
  ]
})
export class SimulatorModule { }
