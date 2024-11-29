import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ServicesG } from '../services/services-g.service';

@Component({
  selector: 'app-modal-asignatura',
  templateUrl: './modal-asignatura.component.html',
  styleUrls: ['./modal-asignatura.component.scss'],
})
export class ModalAsignaturaComponent {
  @Input() asignatura: string = ''; // Recibe el nombre de la asignatura
  @Input() usuario: string | null = ''; // Usuario actual
  historialAsignatura: string[] = []; // Historial de la asignatura

  constructor(
    private modalCtrl: ModalController,
    private servicesG: ServicesG
  ) {}

  // Cargar el historial al abrir el modal
  ionViewWillEnter() {
    if (this.usuario) {
      this.historialAsignatura = this.servicesG.obtenerHistorialPorAsignatura(
        this.usuario,
        this.asignatura
      );
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async scanQR() {
    const permission = await BarcodeScanner.checkPermission({ force: true });

    if (permission.granted) {
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const qrContent = result.content;
        this.historialAsignatura.push(qrContent);
        this.servicesG.guardarHistorialPorAsignatura(
          this.usuario || '',
          this.asignatura,
          qrContent
        );
        alert(`QR escaneado: ${qrContent}`);
      } else {
        alert('El código QR está vacío.');
      }
      BarcodeScanner.showBackground();
    } else {
      alert('Permiso para usar la cámara denegado.');
    }
  }
}
