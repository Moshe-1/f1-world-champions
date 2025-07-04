import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {F1Service} from '../../services/f1.service';
import {NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-season-details',
  templateUrl: './season-details.component.html',
  styleUrls: ['./season-details.component.scss'],
  standalone: true,
  imports: [NgIf, MatTableModule, MatButtonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],

})
export class SeasonDetailsComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  season: any;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private f1Service: F1Service
  ) { }

  ngOnInit(): void {
    const year = this.route.snapshot.paramMap.get('year');
    if (year) {
      this.loadSeasonDetails(+year);
    }
  }

  loadSeasonDetails(year: number): void {
    this.isLoading = true;
    this.f1Service.getSeasonDetails(year).subscribe({
      next: (data) => {
        this.season = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load season details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  isChampion(race: any): boolean {
    return race.results[0].driver.firstName +' '+race.results[0].driver.lastName === this.season.champion;
  }
}
