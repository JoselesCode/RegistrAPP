import { Component } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { isPlatform } from '@ionic/angular';

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
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.router.navigate(['/home']); // Redirigir al login
  }

  async escanearQR() {
    if (isPlatform('capacitor') || isPlatform('android') || isPlatform('ios')) {
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          BarcodeScanner.hideBackground(); // Ocultar fondo al escanear
          const result = await BarcodeScanner.startScan();
          if (result.hasContent) {
            alert('Código QR escaneado: ' + result.content);
          } else {
            alert('No se encontró contenido en el QR');
          }
        } else {
          alert('Permiso de cámara denegado');
        }
      } catch (error) {
        console.error('Error escaneando el código QR:', error);
        alert('Hubo un error al escanear el QR');
      } finally {
        BarcodeScanner.showBackground(); // Mostrar fondo después de escanear
      }
    } else {
      alert('Escaneo de QR no disponible en el navegador.');
    }
    this.router.navigate(['/qr']);
  }
}
