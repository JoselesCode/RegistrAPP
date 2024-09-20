import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesG {
  private usuarioDocente = 'docente';
  private contrasenaDocente = '1234'; // Contraseña de inicio de sesión del docente
  private accesoDocente = 'soydocente'; // Contraseña de acceso del docente

  private usuarioAlumno = 'alumno';
  private contrasenaAlumno = '12345';

  constructor() {}

  validarUsuario(usuario: string, contrasena: string): string {
    if (usuario === this.usuarioAlumno && contrasena === this.contrasenaAlumno) {
      return 'alumno';
    } else if (usuario === this.usuarioDocente && contrasena === this.contrasenaDocente) {
      return 'docente';
    } else {
      return "";
    }
  }

  obtenerContrasenaAccesoDocente(): string {
    return this.accesoDocente;
  }
}
