import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ServicesG {
  cerrarSesion() {
    throw new Error('Method not implemented.');
  }
  private usuarioDocente = 'docente'; // Usuario Docente
  private contrasenaDocente = '1234'; // Contraseña de inicio de sesión del docente
  private accesoDocente = 'soydocente'; // Código de acceso del docente

  private usuarioAlumno = 'alumno'; // Usuario Alumno
  private contrasenaAlumno = '12345'; // Contraseña de inicio de sesión del alumno

  private usuarioActual: string | null = null; // Almacenar el usuario actual
  private _storage: Storage | null = null; // Para manejar el almacenamiento

  constructor(private storage: Storage) {
    this.init(); // Inicializar el storage
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Validar usuario y guardar en Storage
  async validarUsuario(usuario: string, contrasena: string): Promise<string> {
    if (usuario === this.usuarioAlumno && contrasena === this.contrasenaAlumno) {
      this.usuarioActual = usuario;
      await this.guardarDatosUsuario(usuario, contrasena); // Guardar en Storage
      return 'alumno';
    } else if (usuario === this.usuarioDocente && contrasena === this.contrasenaDocente) {
      this.usuarioActual = usuario;
      await this.guardarDatosUsuario(usuario, contrasena); // Guardar en Storage
      return 'docente'; 
    } else {
      this.usuarioActual = null;
      return "";
    }
  }

  // Guardar datos de usuario en Storage
  async guardarDatosUsuario(usuario: string, contrasena: string) {
    await this._storage?.set('usuario', usuario);
    await this._storage?.set('contrasena', contrasena);
  }

  // Obtener datos de usuario desde Storage
  async obtenerDatosUsuario() {
    const usuario = await this._storage?.get('usuario');
    const contrasena = await this._storage?.get('contrasena');
    return { usuario, contrasena };
  }

  // Limpiar datos del Storage
  async limpiarDatos() {
    await this._storage?.clear();
  }

  enviarEmailRecuperacion(usuario: string): boolean {
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
