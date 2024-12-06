import { Component, OnInit } from '@angular/core';
import { ServicesG } from '../services/services-g.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAsignaturaComponent } from '../modal-asignatura/modal-asignatura.component';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  usuario: string = ''; // Usuario actual
  asignaturas: string[] = ['Programación de APP Moviles', 'Portafolio de Titulo', 'Calidad de Software']; // Lista de asignaturas
  historialQR: { asignatura: string; codigo: string }[] = []; // Historial de códigos escaneados

  constructor(
    private modalCtrl: ModalController,
    private servicesG: ServicesG,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.servicesG.getUsuarioActual() || ''; // Obtener el usuario actual
    this.cargarHistorial(); // Cargar historial almacenado
  }

  volver() {
    this.location.back(); // Regresar a la página anterior
  }

  cerrarSesion() {
    this.servicesG.limpiarUsuarioActual(); // Limpiar el usuario actual
    this.router.navigate(['/home']); // Redirigir al inicio
  }

  // Cargar historial de códigos QR (si estás usando Storage)
  cargarHistorial() {
    const historialGuardado = localStorage.getItem(`historial_${this.usuario}`);
    this.historialQR = historialGuardado ? JSON.parse(historialGuardado) : [];
  }

  // Guardar historial actualizado
  guardarHistorial() {
    localStorage.setItem(`historial_${this.usuario}`, JSON.stringify(this.historialQR));
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
}
