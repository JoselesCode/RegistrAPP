import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { ServicesG } from '../services/services-g.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

class MockServicesG {
  estaAutenticado() {
    return true; // Cambia esto según el caso de prueba
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let servicesG: MockServicesG;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: ServicesG, useClass: MockServicesG },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    servicesG = TestBed.inject(ServicesG);

    // Simulaciones de ActivatedRouteSnapshot y RouterStateSnapshot
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    spyOn(servicesG, 'estaAutenticado').and.returnValue(true);
    const result = guard.canActivate(route, state); // Llama a canActivate con los mocks
    expect(result).toBe(true);
  });

  it('should redirect when not authenticated', () => {
    spyOn(servicesG, 'estaAutenticado').and.returnValue(false);
    const result = guard.canActivate(route, state); // Llama a canActivate con los mocks
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
