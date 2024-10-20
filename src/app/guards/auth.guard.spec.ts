import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { ServicesG } from '../services/services-g.service';
import { Router } from '@angular/router';

class MockServicesG {
  // Simula el método de autenticación
  estaAutenticado() {
    return true; // Cambia esto según lo que quieras probar
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let servicesG: MockServicesG; // Agregamos esto para la instancia mock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: ServicesG, useClass: MockServicesG }, // Usar el mock del servicio
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } } // Mock del Router
      ]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    servicesG = TestBed.inject(ServicesG); // Obtener la instancia del servicio mock
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    spyOn(servicesG, 'estaAutenticado').and.returnValue(true); // Simula autenticación exitosa
    const result = guard.canActivate(); // Llama a canActivate
    expect(result).toBe(true); // Comprueba que permite la navegación
  });

  it('should redirect when not authenticated', () => {
    spyOn(servicesG, 'estaAutenticado').and.returnValue(false); // Simula que no está autenticado
    const result = guard.canActivate(); // Llama a canActivate
    expect(result).toBe(false); // Comprueba que bloquea la navegación
    expect(router.navigate).toHaveBeenCalledWith(['/home']); // Verifica que se redirige a /home
  });
});
