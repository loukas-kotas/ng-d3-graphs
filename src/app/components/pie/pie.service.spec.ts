import {TestBed} from '@angular/core/testing';

import {PieService} from './pie.service';

describe('PieService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PieService,
    ]
  }));

  it('should be created', () => {
    const service: PieService = TestBed.get(PieService);
    expect(service).toBeTruthy();
  });
});
