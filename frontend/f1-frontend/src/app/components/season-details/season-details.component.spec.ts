import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SeasonDetailsComponent } from './season-details.component';
import {F1Service} from '../../services/f1.service';

describe('SeasonDetailsComponent', () => {
  let component: SeasonDetailsComponent;
  let fixture: ComponentFixture<SeasonDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockF1Service: any;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '2021'
      }
    }
  };

  beforeEach(async () => {
    mockF1Service = {
      getSeasonDetails: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [SeasonDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: F1Service, useValue: mockF1Service }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load season details on init', () => {
    const mockData = {
      champion: 'Verstappen',
      races: []
    };
    mockF1Service.getSeasonDetails.and.returnValue(of(mockData));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.season).toEqual(mockData);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading season details fails', () => {
    mockF1Service.getSeasonDetails.and.returnValue(throwError(() => new Error('API error')));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.season).toBeUndefined();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('Failed to load season details');
  });

  it('should return true if the driver is the champion', () => {
    component.season = {
      champion: 'Max Verstappen'
    };

    const race = {
      results: [
        { driver: { lastName: 'Verstappen', firstName: 'Max' } }
      ]
    };

    expect(component.isChampion(race)).toBeTrue();
  });

  it('should return false if the driver is not the champion', () => {
    component.season = {
      champion: 'Hamilton'
    };

    const race = {
      results: [
        { driver: { lastName: 'Verstappen' } }
      ],
      circuit: {
        name: '',
        location: ''
      },
      id: 123,
      name: '',
      round: 2,
      date: ''
    };

    expect(component.isChampion(race)).toBeFalse();
  });
});
