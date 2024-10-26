// alumno.page.ts
import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {
  usuario: string | null = '';
  result: string = ''; // Para almacenar el resultado del escaneo
  historialQR: string[] = [];

  constructor(
    private servicesG: ServicesG,
    private location: Location,
    private router: Router
  ) {
    this.usuario = this.servicesG.getUsuarioActual();
    this.historialQR = this.servicesG.obtenerHistorial(this.usuario || ''); // Cargar el historial del usuario actual
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.servicesG.limpiarUsuarioActual(); // Limpiar el usuario actual al cerrar sesión
    this.router.navigate(['/home']); // Redirigir al login
  }

  async scan(): Promise<void> {
    // Verificar y solicitar permisos de cámara
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      // Ocultar el fondo durante el escaneo
      BarcodeScanner.hideBackground();

      // Iniciar el escaneo
      const result = await BarcodeScanner.startScan();

      // Verificar si hay contenido en el QR escaneado
      if (result.hasContent) {
        this.result = result.content; // Almacenar el resultado del escaneo
        this.historialQR.push(this.result); // Agregar al historial
        await this.servicesG.guardarHistorial(this.usuario || '', [this.result]); // Guardar en el almacenamiento
        alert('Código QR escaneado: ' + result.content);
      } else {
        alert('No se encontró contenido en el código QR.');
      }

      // Mostrar de nuevo el fondo
      BarcodeScanner.showBackground();
    } else {
      alert('Permiso para usar la cámara denegado.');
    }
  }
}
