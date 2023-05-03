import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.css']
})
export class ReporteVentaComponent implements OnInit {
  // Se almacena el ID del contribuyente para enviar al grabar el registro
  public contribuyenteId: any;
  // Para almacenar la lista de todos los clientes
  public clientes: any;
  // Listado de las cabecera de venta segun el contribuyente seleccionado
  public cabecerasVenta: any;
  // Excel file
  public fileName = '';

  // Filtro
  // Ops es el array de los proveedores seleccionados por los cuales hay que filtrar
  public ops: number[] = [];
  // El objeto completo del filtro para enviar al servidor
  public filtros = {
    id_cliente: this.ops,
    condicion: "Contado",
    fecha_inicio: "2022-02-11",
    fecha_fin: "2022-02-11"
  };

  constructor(public api: ApiService, private route: ActivatedRoute, private toastr: ToastrService, private excelService: ExcelService) { }

  ngOnInit(): void {
    // Primero se obtiene el ID enviado a travez de la ruta
    const routeParams = this.route.snapshot.paramMap;
    this.contribuyenteId = Number(routeParams.get('id_contribuyente')); //Este parametro se configura en app-routes
    // Consulta las cabeceras segun el id del contribuyente
    this.api.get('cabecera_venta/contribuyente/' + this.contribuyenteId)
      .pipe(map(data => {
        this.cabecerasVenta = data;
        //console.log("El contribuyente es: ", this.cabecerasVenta);
      }))
      .subscribe()
    // Trae todos los clientes registrados
    this.api.get('cliente')
      .pipe(map(data => {
        this.clientes = data;
      }))
      .subscribe()
  }

  // Agrega valores al array de proveedores a buscar con el filtro
  addItem(event: number) {
    this.ops.push(event);
  }
  // Elimina valores del array de proveedores a buscar con el filtro
  deleteItem(event: any) {
    for (let item of this.ops) {
      if (item === event.value) {
        this.ops.splice(this.ops.indexOf(item), 1);
      }
    }
  }

  // Al seleccionar la condicion se modifica el atributo condicion del array del filtro a ser enviado al server
  onChangeCondicion(event: any) {
    this.filtros.condicion = event;
  }

  // Funcion del boton buscar
  buscar() {
    this.filtros.fecha_inicio = ((<HTMLInputElement>document.getElementById("fecha_inicio")).value);
    this.filtros.fecha_fin = ((<HTMLInputElement>document.getElementById("fecha_fin")).value);

    this.api.post('cabecera_venta/contribuyente/' + this.contribuyenteId, this.filtros)
      .pipe(map(data => {
        this.cabecerasVenta = data;
      }))
      .subscribe()
  }

  // Export to excel
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFileVenta(this.cabecerasVenta, 'Reporte de ventas');
  }
}
