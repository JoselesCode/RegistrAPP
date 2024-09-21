import { TestBed } from '@angular/core/testing';
import { ServicesG } from './services-g.service'; // Asegúrate de que este nombre sea correcto

describe('ServicesG', () => { // Cambia 'ServicesGService' por 'ServicesG'
  let service: ServicesG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
