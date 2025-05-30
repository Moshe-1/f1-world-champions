import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SeasonsListComponent } from './seasons-list.component';
import { F1Service, Season } from '../../services/f1.service';
import { ActivatedRoute } from '@angular/router';

describe('SeasonsListComponent', () => {
  let component: SeasonsListComponent;
  let fixture: ComponentFixture<SeasonsListComponent>;
  let mockF1Service: jasmine.SpyObj<F1Service>;

  const mockSeasons: Season[] = [
    { year: 2021, champion: 'Verstappen' },
    { year: 2020, champion: 'Hamilton' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('F1Service', ['getSeasons']);

    await TestBed.configureTestingModule({
      imports: [SeasonsListComponent],
      providers: [
        { provide: F1Service, useValue: spy },
        { provide: ActivatedRoute, useValue: {} } // ✅ Mock ActivatedRoute
      ]
    }).compileComponents();

    mockF1Service = TestBed.inject(F1Service) as jasmine.SpyObj<F1Service>;
    fixture = TestBed.createComponent(SeasonsListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load seasons on init', () => {
    mockF1Service.getSeasons.and.returnValue(of(mockSeasons));

    fixture.detectChanges();

    expect(mockF1Service.getSeasons).toHaveBeenCalled();
    expect(component.seasons).toEqual(mockSeasons);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading seasons fails', () => {
    mockF1Service.getSeasons.and.returnValue(throwError(() => new Error('Network error')));

    fixture.detectChanges();

    expect(component.seasons).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('Failed to load seasons');
  });
});
