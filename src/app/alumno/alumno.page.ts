import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'; // Importar BarcodeScanner

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage {
  usuario: string | null = '';

  constructor(private servicesG: ServicesG, private location: Location, private router: Router) {
    this.usuario = this.servicesG.getUsuarioActual();
  }

  volver() {
    this.location.back();
  }

  cerrarSesion() {
    this.router.navigate(['/home']);
  }

  // Método para iniciar el escaneo
  async startScan() {
    try {
      // Solicitar permiso de cámara
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // Ocultar la interfaz de la app para ver el escáner
        BarcodeScanner.hideBackground();

        // Iniciar el escaneo
        const result = await BarcodeScanner.startScan();

        // Verificar si hay contenido escaneado
        if (result.hasContent) {
          alert('Código QR detectado: ' + result.content); // Mostrar el contenido escaneado
        } else {
          alert('No se detectó ningún código QR');
        }

      } else {
        alert('Permiso de cámara denegado');
      }
    } catch (e) {
      console.error('Error al escanear:', e);
    }
  }
}
