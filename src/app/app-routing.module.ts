import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa tu guard

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'seleccion',
    loadChildren: () => import('./seleccion/seleccion.module').then(m => m.SeleccionPageModule)
  },
  {
    path: 'alumno',
    loadChildren: () => import('./alumno/alumno.module').then(m => m.AlumnoPageModule),
    canActivate: [AuthGuard]  // Protegido por el guard
  },
  {
    path: 'docente',
    loadChildren: () => import('./docente/docente.module').then(m => m.DocentePageModule),
    canActivate: [AuthGuard]  // Protegido por el guard
  },
  {
    path: 'recuperar-c',
    loadChildren: () => import('./recuperar-c/recuperar-c.module').then(m => m.RecuperarCPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then(m => m.QrPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
