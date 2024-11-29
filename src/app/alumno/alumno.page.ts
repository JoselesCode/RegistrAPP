import { Component, OnInit } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalController } from '@ionic/angular';
import { ModalAsignaturaComponent } from '../modal-asignatura/modal-asignatura.component';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: string = ''; // Usuario actual
  result: string = ''; // Para almacenar el resultado del escaneo
  historialQR: string[] = []; // Historial de códigos QR escaneados
  asignaturas: string[] = ['Matemáticas', 'Historia', 'Ciencias']; // Lista de asignaturas

  constructor(
    private modalCtrl: ModalController,
    private servicesG: ServicesG,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    const asignatura = 'Matemáticas'; // Puedes cambiar la asignatura por una dinámica si es necesario
    this.usuario = this.servicesG.getUsuarioActual() || ''; // Obtener el usuario actual
    this.historialQR = this.servicesG.obtenerHistorial(this.usuario, asignatura); // Cargar el historial de esta asignatura
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.servicesG.limpiarUsuarioActual(); // Limpiar el usuario actual
    this.router.navigate(['/home']); // Redirigir al inicio
  }

  async scan(): Promise<void> {
    // Verificar permisos de cámara
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      // Ocultar el fondo durante el escaneo
      BarcodeScanner.hideBackground();

      try {
        // Iniciar el escaneo
        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          this.result = result.content; // Guardar el contenido del QR escaneado
          const asignatura = 'Matemáticas'; // Asignatura actual
          this.historialQR.push(this.result); // Agregar al historial
          this.servicesG.guardarHistorial(this.usuario, asignatura, this.historialQR); // Guardar en almacenamiento
          alert('Código QR escaneado: ' + this.result);
        } else {
          alert('No se encontró contenido en el código QR.');
        }
      } catch (error) {
        console.error('Error durante el escaneo:', error);
      } finally {
        // Mostrar de nuevo el fondo
        BarcodeScanner.showBackground();
      }
    } else {
      alert('Permiso para usar la cámara denegado.');
    }
  }

  async abrirModalAsignatura(asignatura: string) {
    const modal = await this.modalCtrl.create({
      component: ModalAsignaturaComponent,
      componentProps: {
        asignatura: asignatura,
        usuario: this.usuario, // Pasar el usuario actual al modal
      },
    });
    return await modal.present();
  }

  async guardarQR(result: string) {
    if (result) {
      const asignatura = 'Matemáticas'; // Asignatura actual
      this.historialQR.push(result); // Agregar el QR al historial
      await this.servicesG.guardarHistorial(this.usuario, asignatura, this.historialQR); // Guardar en almacenamiento
    }
  }
}
