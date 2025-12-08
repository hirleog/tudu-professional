import { TestBed } from '@angular/core/testing';

import { AgendaChronologyService } from './agenda-chronology.service';

describe('AgendaChronologyService', () => {
  let service: AgendaChronologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaChronologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
