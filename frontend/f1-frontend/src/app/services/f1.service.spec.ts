import { TestBed } from '@angular/core/testing';
import { F1Service, Season } from './f1.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('F1Service', () => {
  let service: F1Service;
  let httpMock: HttpTestingController;

  const mockSeasons: Season[] = [
    { year: 2021, champion: 'Verstappen' },
    { year: 2020, champion: 'Hamilton' }
  ];

  const mockSeasonDetails = {
    year: 2021,
    champion: 'Verstappen',
    races: [
      {
        id: 1,
        name: 'Bahrain Grand Prix',
        round: 1,
        date: '2021-03-28',
        circuit: {
          name: 'Bahrain International Circuit',
          location: { locality: 'Sakhir', country: 'Bahrain' }
        },
        results: [
          {
            position: 1,
            points: 25,
            driver: { firstName: 'Max', lastName: 'Verstappen' },
            constructor: { name: 'Red Bull' }
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [F1Service]
    });
    service = TestBed.inject(F1Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch seasons', () => {
    service.getSeasons().subscribe((data) => {
      expect(data).toEqual(mockSeasons);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/seasons');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeasons);
  });

  it('should fetch season details by year', () => {
    service.getSeasonDetails(2021).subscribe((data) => {
      expect(data).toEqual(mockSeasonDetails);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/seasons/2021');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeasonDetails);
  });
});
