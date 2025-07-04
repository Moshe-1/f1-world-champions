import { Component, OnInit } from '@angular/core';
import { F1Service, Season } from '../../services/f1.service';
import {NgFor, NgIf} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-seasons-list',
  templateUrl: './seasons-list.component.html',
  styleUrls: ['./seasons-list.component.scss'],
  standalone: true,
  imports: [NgIf, MatListModule,MatIconModule, RouterModule, NgFor],

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
