import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeasonsListComponent } from './components/seasons-list/seasons-list.component';
import { SeasonDetailsComponent } from './components/season-details/season-details.component';

const routes: Routes = [
  { path: '', component: SeasonsListComponent, pathMatch: 'full' }, // Add pathMatch
  { path: 'season/:year', component: SeasonDetailsComponent },
  { path: '**', redirectTo: '' } // Fallback

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
