import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesG {
  private usuarioDocente = 'docente'; // Usuario Docente
  private contrasenaDocente = '1234'; // Contraseña de inicio de sesión del docente
  private accesoDocente = 'soydocente'; // Código de acceso del docente

  private usuarioAlumno = 'alumno'; // Usuario Alumno
  private contrasenaAlumno = '12345'; // Contraseña de inicio de sesión del alumno

  private usuarioActual: string | null = null; // Almacenar el usuario actual

  constructor() {}

  validarUsuario(usuario: string, contrasena: string): string {
    if (usuario === this.usuarioAlumno && contrasena === this.contrasenaAlumno) {
      this.usuarioActual = usuario; // Guardar usuario actual
      return 'alumno';
    } else if (usuario === this.usuarioDocente && contrasena === this.contrasenaDocente) {
      this.usuarioActual = usuario; // Guardar usuario actual
      return 'docente'; 
    } else {
      this.usuarioActual = null; // No hay usuario actual
      return "";
    }
  }

  enviarEmailRecuperacion(usuario: string): boolean {
    // Pendiente recuperar contraseña 
    if (usuario === 'usuarioExistente') {
      return true;
    }
    return false; 
  }

  getUsuarioActual(): string | null {
    return this.usuarioActual; 
  }

  obtenerContrasenaAccesoDocente(): string {
    return this.accesoDocente;
  }
}
