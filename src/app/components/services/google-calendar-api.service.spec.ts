import { TestBed } from '@angular/core/testing';

import { GoogleCalendarApiService } from './google-calendar-api.service';

describe('GoogleCalendarApiService', () => {
  let service: GoogleCalendarApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleCalendarApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
