import { TestBed } from '@angular/core/testing';

import { PurpleThemeService } from './purple-theme.service';

describe('PurpleThemeService', () => {
  let service: PurpleThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurpleThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
