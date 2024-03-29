import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'simulator', loadChildren: () => import('./features/simulator/simulator.module').then(m => m.SimulatorModule) },
  { path: 'game', loadChildren: () => import('./features/game/game.module').then(m => m.GameModule) }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}