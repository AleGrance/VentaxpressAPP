import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ContribuyenteComponent } from './pages/contribuyente/contribuyente.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetalleClienteComponent } from './pages/detalle-cliente/detalle-cliente.component';
import { FacturaCompraComponent } from './pages/factura-compra/factura-compra.component';
import { FacturaVentaComponent } from './pages/factura-venta/factura-venta.component';
import { LoginComponent } from './pages/login/login.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ReporteCompraComponent } from './pages/reporte-compra/reporte-compra.component';
import { ReporteVentaComponent } from './pages/reporte-venta/reporte-venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { ArticuloComponent } from './pages/articulo/articulo.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'articulo_component', component: ArticuloComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracion_component', component: ConfiguracionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contribuyente_component', component: ContribuyenteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cliente_component', component: ClienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedor_component', component: ProveedorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte_component', component: ReporteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cuenta_component', component: CuentaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'factura-compra/:id_contribuyente', component: FacturaCompraComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'factura-venta/:id_contribuyente', component: FacturaVentaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-cliente/:id_cliente', component: DetalleClienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte-compra/:id_contribuyente', component: ReporteCompraComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte-venta/:id_contribuyente', component: ReporteVentaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent
  },

  // El modulo cuentas_module se importa pero no se usa. Fue para probar el lazy loading pero no se logro configurar el html
  {
    path: 'cuentas_module',
    loadChildren: () => import('./modulos/cuentas/cuentas.module').then(m => m.CuentasModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
