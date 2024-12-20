import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common'; // Importar Location

@Component({
  selector: 'app-seleccion',
  templateUrl: 'seleccion.page.html',
  styleUrls: ['seleccion.page.scss'],
})
export class SeleccionPage {
  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private servicesG: ServicesG,
    private location: Location // Inyectar Location
  ) {}

  // Método para manejar la selección de rol y mostrar confirmación
  async confirmarSeleccionRol(rol: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Selección',
      message: `¿Estás seguro que deseas elegir el rol de ${rol}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Selección de rol cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Si el rol es "Docente", abre el cuadro de código de acceso
            if (rol === 'Docente') {
              this.irDocente();
            } else if (rol === 'Alumno') {
              this.irAlumno();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  irAlumno() {
    this.router.navigate(['/alumno']);
  }

  async irDocente() {
    const alert = await this.alertController.create({
      header: 'Código de acceso',
      inputs: [
        {
          name: 'codigoAcceso',
          type: 'password',
          placeholder: 'Ingresa el código de acceso'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return true; 
          }
        },
        {
          text: 'Verificar',
          handler: (data) => {
            if (!data.codigoAcceso) {
              this.mostrarError('Por favor, ingrese el código de acceso.');
              return false; 
            }
            if (data.codigoAcceso === this.servicesG.obtenerContrasenaAccesoDocente()) {
              this.router.navigate(['/docente']);
              return true; // Se navega a la página docente 
            } else {
              this.mostrarError('Código de acceso incorrecto.');
              return false; // El cuadro permanece abierto si el código es incorrecto.
            }
          }
        }
      ]
    });

    await alert.present();
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.router.navigate(['/home']); // Redirigir al login
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
