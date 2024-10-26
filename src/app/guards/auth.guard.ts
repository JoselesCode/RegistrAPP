import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ServicesG } from '../services/services-g.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private servicesG: ServicesG, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: unknown): boolean {
    const userRole: string = this.servicesG.obtenerRol();
    
    if (userRole === 'alumno' && route.url[0].path === 'docente') {
      alert('No tienes permisos para acceder a esta página.');
      this.router.navigate(['/seleccion']); // Redirige a la página de alumno
      return false;
    }
    
    return true;
  }
}
