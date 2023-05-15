import { Component, OnInit } from '@angular/core';

import { DatePipe, CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEsPy from '@angular/common/locales/es-PY';

import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { faEye } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  public cajaId: any;
  public cabeceras: any;
  public detalles: any;
  public nroComprobante: any;
  public fecha: any;
  public total: any;

  public faEye = faEye;

  constructor(public api: ApiService, private route: ActivatedRoute, private toastr: ToastrService) {
    registerLocaleData(localeEsPy);
  }

  ngOnInit(): void {
    // Primero se obtiene el ID de la caja
    this.cajaId = localStorage.getItem('id_caja');

    this.api.get('cabecera_ventaByCaja/' + this.cajaId)
      .pipe(map(data => {
        this.cabeceras = data;
        console.log("Cabeceras: ", this.cabeceras);
      }))
      .subscribe()
  }

  showDetalle(event: any) {
    this.nroComprobante = event.nro_factura_venta;
    this.fecha = event.fecha_factura_venta;
    this.total = event.total_venta;

    this.api.get('detalle_venta/' + this.nroComprobante)
      .pipe(map(data => {
        this.detalles = data;
        console.log("Detalles: ", this.detalles);
      }))
      .subscribe()
  }

}
