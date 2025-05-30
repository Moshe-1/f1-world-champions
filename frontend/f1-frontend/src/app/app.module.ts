// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { SeasonsListComponent } from './components/seasons-list/seasons-list.component';
import { SeasonDetailsComponent } from './components/season-details/season-details.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: SeasonsListComponent,
    pathMatch: 'full'  // ← Add this
  },
  {
    path: 'season/:year',
    component: SeasonDetailsComponent
  },
  {
    path: '**',
    redirectTo: ''  // ← Proper wildcard redirect
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SeasonsListComponent,
    SeasonDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
