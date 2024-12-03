import { Component, OnInit } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalAsignaturaComponent } from '../modal-asignatura/modal-asignatura.component';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: string = ''; // Usuario actual
  asignaturas: string[] = ['Programación de APP Moviles', 'Portafolio de Titulo', 'Calidad de Software']; // Lista de asignaturas

  constructor(
    private modalCtrl: ModalController,
    private servicesG: ServicesG,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.servicesG.getUsuarioActual() || ''; // Obtener el usuario actual
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.servicesG.limpiarUsuarioActual(); // Limpiar el usuario actual
    this.router.navigate(['/home']); // Redirigir al inicio
  }

  // Abrir el modal para registrar la asistencia
  async abrirModalAsignatura(asignatura: string) {
    const modal = await this.modalCtrl.create({
      component: ModalAsignaturaComponent,
      componentProps: {
        asignatura: asignatura,
        usuario: this.usuario,
      },
    });
    return await modal.present();
  }

  // Función de escaneo de QR (Capacitor)
  async escanearQR(asignatura: string) {
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      BarcodeScanner.hideBackground();

      try {
        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          // Guardar el código escaneado para la asignatura actual
          alert(`Código QR para ${asignatura}: ${result.content}`);
        } else {
          alert('No se encontró contenido en el código QR.');
        }
      } catch (error) {
        console.error('Error durante el escaneo:', error);
      } finally {
        BarcodeScanner.showBackground();
      }
    } else {
      alert('Permiso para usar la cámara denegado.');
    }
  }
}
