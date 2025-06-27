import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, Routes} from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {SeasonsListComponent} from './components/seasons-list/seasons-list.component';
import {SeasonDetailsComponent} from './components/season-details/season-details.component';
import {provideHttpClient} from '@angular/common/http';
const routes: Routes = [
  {
    path: '',
    component: SeasonsListComponent,
    pathMatch: 'full'
  },
  {
    path: 'season/:year',
    component: SeasonDetailsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient()]
};
