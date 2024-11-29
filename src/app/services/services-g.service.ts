import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesG {
  private apiKey: string = '606d647c5e9f50c12197183edb586441'; // Reemplaza con tu API Key
  private apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=San%20Joaquín,CL&appid=${this.apiKey}&units=metric`;

  private usuarioDocente = 'docente';
  private contrasenaDocente = '1234';
  private accesoDocente = 'soydocente';
  private contrasenaTemporal: string = '';
  tiempoExpiracion: number = Date.now() + 120000;

  private usuarioAlumno = 'alumno';
  private contrasenaAlumno = '12345';

  private usuarioActual: string | null = null;
  private _storage: Storage | null = null;

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
      catchError((error) => {
        console.error('Error al obtener el clima', error);
        return of(null);
      })
    );
  }

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
      return '';
    }
  }

  private async guardarDatosUsuario(usuario: string, contrasena: string) {
    await this._storage?.set('usuarioActual', usuario);
    await this._storage?.set('contrasena', contrasena);
  }

  async obtenerDatosUsuario() {
    const usuario = await this._storage?.get('usuarioActual');
    const contrasena = await this._storage?.get('contrasena');
    return { usuario, contrasena };
  }

  async limpiarDatos() {
    await this._storage?.clear();
  }

  getUsuarioActual(): string | null {
    return this.usuarioActual;
  }

  async cerrarSesion() {
    await this.limpiarDatos();
    localStorage.removeItem('token');
    this.usuarioActual = null;
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerContrasenaAccesoDocente(): string {
    return this.accesoDocente;
  }

  // Guardar historial por asignatura
  async guardarHistorialPorAsignatura(usuario: string, asignatura: string, qr: string[]) {
    const key = `${usuario}-${asignatura}`;
    await this._storage?.set(key, qr);
  }

  // Obtener historial por asignatura
  async obtenerHistorialPorAsignatura(usuario: string, asignatura: string): Promise<string[]> {
    const key = `${usuario}-${asignatura}`;
    const historial = await this._storage?.get(key);
    return historial || [];
  }

  // Limpiar historial por asignatura
  async limpiarHistorialPorAsignatura(usuario: string, asignatura: string) {
    const key = `${usuario}-${asignatura}`;
    await this._storage?.remove(key);
  }

  limpiarUsuarioActual() {
    localStorage.removeItem('usuarioActual');
    this.usuarioActual = null;
  }

  obtenerRol(): string {
    const token = localStorage.getItem('token');
    if (token === 'tokenAlumno') {
      return 'alumno';
    } else if (token === 'tokenDocente') {
      return 'docente';
    }
    return '';
  }

  generarContrasenaTemporal(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contrasena = '';
    for (let i = 0; i < 8; i++) {
      contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    this.contrasenaTemporal = contrasena;
    this.tiempoExpiracion = Date.now() + 2 * 60 * 1000;
    return this.contrasenaTemporal;
  }

  verificarContrasenaTemporal(usuario: string, contrasena: string): boolean {
    return usuario === 'alumno' &&
      contrasena === this.contrasenaTemporal &&
      Date.now() < this.tiempoExpiracion;
  }


  obtenerHistorial(usuario: string, asignatura: string): string[] {
    const key = `${usuario}-${asignatura}`;
    const historial = localStorage.getItem(key);
    return historial ? JSON.parse(historial) : [];
  }
  guardarHistorial(usuario: string, asignatura: string, qr: string[]) {
    const key = `${usuario}-${asignatura}`;
    localStorage.setItem(key, JSON.stringify(qr));
  }
}
