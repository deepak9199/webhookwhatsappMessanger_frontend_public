import { TestBed } from '@angular/core/testing';

import { SendmessageService } from './sendmessage.service';

describe('SendmessageService', () => {
  let service: SendmessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendmessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
