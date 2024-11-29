import { Component, OnInit } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ModalController, AlertController } from '@ionic/angular';
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
  asignaturas: string[] = ['Programación de APP Moviles', 'Portafolio de Titulo', 'Calidad de Software']; // Lista de asignaturas
  asignaturaSeleccionada: string = ''; // Asignatura seleccionada para el escaneo

  constructor(
    private modalCtrl: ModalController,
    private servicesG: ServicesG,
    private location: Location,
    private router: Router,
    private alertController: AlertController // Inyectar AlertController
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

  // Función que muestra un mensaje de confirmación antes de escanear el código QR
  async confirmarEscaneo() {
    const alert = await this.alertController.create({
      header: 'Confirmar Selección de Asignatura',
      message: `¿Estás seguro de que deseas ingresar la asignatura: ${this.asignaturaSeleccionada}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Seleccion cancelada');
          }
        },
        {
          text: 'Sí, Ingresar',
          handler: () => {
            this.abrirModalAsignatura(this.asignaturaSeleccionada); // Solo abrir el modal si el usuario confirma
          }
        }
      ]
    });

    await alert.present();
  }

  // Función de escaneo
  async scan(): Promise<void> {
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      BarcodeScanner.hideBackground();
      
      try {
        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          this.result = result.content;
          this.historialQR.push(this.result);
          this.servicesG.guardarHistorial(this.usuario, this.asignaturaSeleccionada, this.historialQR);
          alert('Código QR escaneado: ' + this.result);
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

  // Función para seleccionar la asignatura antes de escanear
  selectAsignatura(asignatura: string) {
    this.asignaturaSeleccionada = asignatura;
    this.confirmarEscaneo(); // Muestra el mensaje de confirmación antes de ver el historial
  }

  // Abrir el modal para mostrar el historial
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

  // Función para guardar el QR escaneado en el historial
  async guardarQR(result: string) {
    if (result) {
      this.historialQR.push(result);
      await this.servicesG.guardarHistorial(this.usuario, this.asignaturaSeleccionada, this.historialQR);
    }
  }
}
