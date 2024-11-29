import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializar el Storage
  async init() {
    this._storage = await this.storage.create();
  }

  // Guardar un QR en el historial de una asignatura
  async guardarQR(asignatura: string, qr: string) {
    const historial = (await this._storage?.get('historial')) || {}; // Recuperar historial
    if (!historial[asignatura]) {
      historial[asignatura] = [];
    }
    historial[asignatura].push(qr); // Añadir nuevo QR
    await this._storage?.set('historial', historial); // Guardar de nuevo
  }

  // Obtener el historial de una asignatura
  async obtenerHistorial(asignatura: string): Promise<string[]> {
    const historial = (await this._storage?.get('historial')) || {};
    return historial[asignatura] || [];
  }

  // Limpiar el historial de una asignatura
  async limpiarHistorial(asignatura: string) {
    const historial = (await this._storage?.get('historial')) || {};
    delete historial[asignatura];
    await this._storage?.set('historial', historial);
  }
}
