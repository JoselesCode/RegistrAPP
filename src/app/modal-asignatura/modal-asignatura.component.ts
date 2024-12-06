import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServicesG } from '../services/services-g.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-modal-asignatura',
  templateUrl: './modal-asignatura.component.html',
  styleUrls: ['./modal-asignatura.component.scss'],
})
export class ModalAsignaturaComponent {
  @Input() asignatura!: string; // Recibe la asignatura seleccionada
  @Input() usuario!: string; // Recibe el usuario actual

  historialQR: string[] = [];
  result: string = ''; // Para almacenar el QR escaneado

  constructor(private modalCtrl: ModalController, private servicesG: ServicesG) {}

  // Al abrir el modal, cargar el historial para la asignatura seleccionada
  async ionViewWillEnter() {
    this.historialQR = await this.servicesG.obtenerHistorial(
      this.usuario || '',
      this.asignatura
    );
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  // Método para manejar el escaneo, validar y guardar en el historial
  async scan(): Promise<void> {
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.result = result.content;

        // Validar formato del QR
        if (this.validarFormatoQR(this.result)) {
          this.historialQR.push(this.result); // Agregar al historial local

          // Guardar el historial actualizado para la asignatura seleccionada
          await this.servicesG.guardarHistorial(
            this.usuario || '',
            this.asignatura,
            this.historialQR
          );

          alert('Código QR válido escaneado: ' + this.result);
        } else {
          alert('El formato del código QR no es válido.');
        }
      } else {
        alert('No se encontró contenido en el código QR.');
      }

      BarcodeScanner.showBackground();
    } else {
      alert('Permiso para usar la cámara denegado.');
    }
  }

  // Método para validar el formato del QR
  validarFormatoQR(qr: string): boolean {
    // Expresión regular para validar el formato ASIGNATURA|SECCION|SALA|FECHA
    const regex = /^[^|]+\|[^|]+\|[^|]+\|\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(qr);
  }
}
