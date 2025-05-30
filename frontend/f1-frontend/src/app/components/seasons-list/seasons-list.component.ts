// src/app/components/seasons-list/seasons-list.component.ts
import { Component, OnInit } from '@angular/core';
import { F1Service, Season } from '../../services/f1.service';

@Component({
  selector: 'app-seasons-list',
  templateUrl: './seasons-list.component.html',
  styleUrls: ['./seasons-list.component.css']
})
export class SeasonsListComponent implements OnInit {
  seasons: Season[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private f1Service: F1Service) { }

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.isLoading = true;
    this.f1Service.getSeasons().subscribe({
      next: (data) => {
        this.seasons = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load seasons';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
