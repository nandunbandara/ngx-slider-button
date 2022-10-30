import { TestBed } from '@angular/core/testing';

import { NgxSliderButtonService } from './ngx-slider-button.service';

describe('NgxSliderButtonService', () => {
  let service: NgxSliderButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSliderButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
