import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherService } from './weather.service'; // Asegúrate de importar el servicio de clima

@Injectable({
  providedIn: 'root'
})
export class ServicesG {
  obtenerClimaSanJoaquin(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Retorna un observable de la respuesta
  }
  private apiKey: string = '606d647c5e9f50c12197183edb586441'; // Reemplaza con tu API Key
  private apiUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=San%20Joaquín,CL&appid=${this.apiKey}&units=metric`;

  private usuarioDocente = 'docente'; // Usuario Docente
  private contrasenaDocente = '1234'; // Contraseña de inicio de sesión del docente
  private accesoDocente = 'soydocente'; // Código de acceso del docente

  private usuarioAlumno = 'alumno'; // Usuario Alumno
  private contrasenaAlumno = '12345'; // Contraseña de inicio de sesión del alumno

  private usuarioActual: string | null = null; // Almacenar el usuario actual
  private _storage: Storage | null = null; // Para manejar el almacenamiento

  constructor(private storage: Storage, private http: HttpClient, private weatherService: WeatherService) { 
    this.init(); // Inicializar el storage
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Método para obtener el clima de San Joaquín
  obtenerClima(ciudad: string): Observable<any> {
    const url = `${this.apiUrl}&q=${ciudad}`; // Asegúrate de construir la URL correctamente
    return this.http.get(url);
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

  // Limpiar datos del Storage (usado para cerrar sesión o limpiar los datos guardados)
  async limpiarDatos() {
    await this._storage?.clear();
  }

  // Método para enviar un email de recuperación de contraseña
  enviarEmailRecuperacion(usuario: string): boolean {
    if (usuario === 'usuarioExistente') { // Aquí debes implementar la lógica real para verificar el usuario
      return true;
    }
    return false; 
  }

  // Obtener el usuario actual
  getUsuarioActual(): string | null {
    return this.usuarioActual; 
  }

  // Obtener el código de acceso del docente
  obtenerContrasenaAccesoDocente(): string {
    return this.accesoDocente;
  }

  // Implementar el método para cerrar sesión limpiando los datos guardados
  async cerrarSesion() {
    await this.limpiarDatos();
    this.usuarioActual = null;
  }
}
