import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; //se importa
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ContribuyenteComponent } from './pages/contribuyente/contribuyente.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FacturaCompraComponent } from './pages/factura-compra/factura-compra.component';
import { DetalleClienteComponent } from './pages/detalle-cliente/detalle-cliente.component';
import { FacturaVentaComponent } from './pages/factura-venta/factura-venta.component';
import { ReporteCompraComponent } from './pages/reporte-compra/reporte-compra.component';
import { ReporteVentaComponent } from './pages/reporte-venta/reporte-venta.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ArticuloComponent } from './pages/articulo/articulo.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProveedorComponent,
    ClienteComponent,
    ContribuyenteComponent,
    ReporteComponent,
    CuentaComponent,
    FacturaCompraComponent,
    DetalleClienteComponent,
    FacturaVentaComponent,
    ReporteCompraComponent,
    ReporteVentaComponent,
    DashboardComponent,
    ArticuloComponent,
    ConfiguracionComponent  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,   //se usa la version 7 que es compatible con el angular 12
    HttpClientModule, //se importa
    ToastrModule.forRoot(), // ToastrModule added
    DataTablesModule

  ],
  providers: [
    AuthGuard, {
      // Para agregar una cabecera extra a las peticiones
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
