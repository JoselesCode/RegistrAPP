import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesG {
  private apiKey: string = '606d647c5e9f50c12197183edb586441'; // Reemplaza con tu API Key
  private apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=San%20Joaquín,CL&appid=${this.apiKey}&units=metric`;

  private usuarioDocente = 'docente';
  private contrasenaDocente = '1234';
  private accesoDocente = 'soydocente';

  private usuarioAlumno = 'alumno';
  private contrasenaAlumno = '12345';

  private usuarioActual: string | null = null;
  private _storage: Storage | null = null;
  private storageKey: string = 'historialQR';

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Método para obtener el clima de San Joaquín
  obtenerClimaSanJoaquin(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener el clima', error);
        return of(null); // Retorna un observable nulo en caso de error
      })
    );
  }

  // Validar usuario y guardar en Storage
  async validarUsuario(usuario: string, contrasena: string): Promise<string> {
    if (usuario === this.usuarioAlumno && contrasena === this.contrasenaAlumno) {
      this.usuarioActual = usuario;
      await this.guardarDatosUsuario(usuario, contrasena);
      localStorage.setItem('token', 'tokenAlumno');
      return 'alumno';
    } else if (usuario === this.usuarioDocente && contrasena === this.contrasenaDocente) {
      this.usuarioActual = usuario;
      await this.guardarDatosUsuario(usuario, contrasena);
      localStorage.setItem('token', 'tokenDocente');
      return 'docente';
    } else {
      this.usuarioActual = null;
      return "";
    }
  }

  // Guardar datos de usuario en Storage
  private async guardarDatosUsuario(usuario: string, contrasena: string) {
    await this._storage?.set('usuarioActual', usuario);
    await this._storage?.set('contrasena', contrasena);
  }

  // Obtener datos de usuario desde Storage
  async obtenerDatosUsuario() {
    const usuario = await this._storage?.get('usuarioActual');
    const contrasena = await this._storage?.get('contrasena');
    return { usuario, contrasena };
  }

  // Limpiar datos del Storage
  async limpiarDatos() {
    await this._storage?.clear();
  }

  // Obtener el usuario actual
  getUsuarioActual(): string | null {
    return this.usuarioActual;
  }

  // Método para enviar un email de recuperación de contraseña
  enviarEmailRecuperacion(usuario: string): boolean {
    return usuario === 'usuarioExistente';
  }

  // Implementar el método para cerrar sesión
  async cerrarSesion() {
    await this.limpiarDatos();
    localStorage.removeItem('token');
    this.limpiarUsuarioActual(); // Limpia el usuario actual
  }

  // Verificar autenticación
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener la contraseña de acceso del docente
  obtenerContrasenaAccesoDocente(): string {
    return this.accesoDocente; // Retorna la contraseña de acceso
  }

  // Guardar historial de QR por usuario
  guardarHistorial(usuario: string, historial: string[]) {
    const datos = this.obtenerHistorial(usuario) || [];
    const nuevoHistorial = [...datos, ...historial];
    localStorage.setItem(this.storageKey + usuario, JSON.stringify(nuevoHistorial));
  }

  // Obtener historial de QR por usuario
  obtenerHistorial(usuario: string): string[] {
    const datos = localStorage.getItem(this.storageKey + usuario);
    return datos ? JSON.parse(datos) : [];
  }

  // Método para limpiar el usuario actual
  limpiarUsuarioActual() {
    localStorage.removeItem('usuarioActual'); // Limpiar el usuario actual del almacenamiento local
    this.usuarioActual = null; // Limpiar la variable de usuarioActual
  }

  // Método para obtener el rol del usuario actual desde el token en localStorage
  obtenerRol(): string {
    const token = localStorage.getItem('token');
    if (token === 'tokenAlumno') {
      return 'alumno';
    } else if (token === 'tokenDocente') {
      return 'docente';
    }
    return ''; // Retorna una cadena vacía si no hay rol
  }
}
