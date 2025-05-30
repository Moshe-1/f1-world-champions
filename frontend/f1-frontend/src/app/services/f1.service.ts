// src/app/services/f1.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Season {
  year: number;
  champion: string;
}

export interface Race {
  id: number;
  name: string;
  round: number;
  date: string;
  results: Result[];
  circuit: Circuit;
}

export interface Result {
  position: number;
  points: number;
  driver: Driver;
  constructor: Constructor;
}

export interface Driver {
  firstName: string;
  lastName: string;
}

export interface Constructor {
  name: string;
}

export interface Circuit {
  name: string;
  location: Location;
}

export interface Location {
  locality: string;
  country: string;
}

@Injectable({
  providedIn: 'root' // This ensures the service is available app-wide
})
export class F1Service {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Update getSeasons to properly type the response
  getSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(`${this.apiUrl}/seasons`);
  }

  getSeasonDetails(year: number): Observable<object> {
    return this.http.get<object>(`${this.apiUrl}/seasons/${year}`);
  }
}
