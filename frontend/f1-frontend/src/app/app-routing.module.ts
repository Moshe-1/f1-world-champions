// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeasonsListComponent } from './components/seasons-list/seasons-list.component';
import { SeasonDetailsComponent } from './components/season-details/season-details.component';

const routes: Routes = [
  { path: '', component: SeasonsListComponent },
  { path: 'season/:year', component: SeasonDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
