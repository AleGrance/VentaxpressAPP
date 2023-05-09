import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, registerLocaleData, DatePipe } from '@angular/common';
import localeEsPy from '@angular/common/locales/es-PY';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  i: number = 0;

  constructor(public api: ApiService, private authService: AuthService, private toastr: ToastrService) {
    registerLocaleData(localeEsPy);
  }

  public pipe = new DatePipe('en-US');

  // Fecha
  public hoy = new Date();
  public hoyFormated = this.pipe.transform(this.hoy, 'dd-MM-yyyy')
  // Icons
  faTrash = faTrash;
  //public contribuyentes: any;
  public clientes: any;
  public clienteSeleccionadoID: any;
  public articulos: any;
  public totalCabeceras: any;
  public nroComprobante: any;
  //public proveedores: any;
  //public fullData: number[] = [];

  public filasProductos = [
    { articulo: '', precio: 0, cantidad: 1, subtotal: 0 }
  ]

  // El formulario del registro de la factura
  public facturaForm: any;

  // Declaracion de variable tipo funcion flecha para obtener el total con cada cambio
  public total = () => {
    var total = 0;

    for (let p of this.filasProductos) {
      total += p.precio * p.cantidad;
    }

    return total;
  }

  // Imagen del comprobante
  public image = '';

  ngOnInit(): void {
    this.api.get("cliente")
      .pipe(map(data => {
        this.clientes = data;
        //this.fullData.push(this.contribuyentes.length);
        //this.getCliente();
        //console.log(this.clientes);
      }))
      .subscribe()

    this.api.get("cabecera_venta_total")
      .pipe(map(data => {
        this.totalCabeceras = data;
        this.nroComprobante = '0000' + (parseFloat(this.totalCabeceras.total) + 1)
        //console.log('El nuevo nro de comprobante es: 000' + this.totalCabeceras.total + 1);
      }))
      .subscribe()

    this.api.get("articulo")
      .pipe(map(data => {
        this.articulos = data;
        //console.log(this.articulos);
      }))
      .subscribe()

    // Checks if user is logged in
    //console.log(this.authService.getToken());

    // Se crea el FormGroup
    this.facturaForm = new FormGroup({
      cliente: new FormControl("", [
        Validators.required
      ]),
      // articulo: new FormControl(this.filasProductos[0].producto, [
      //   Validators.required
      // ]),
      // precio: new FormControl(this.filasProductos[0].precio, [
      //   Validators.required
      // ]),
      // cantidad: new FormControl(this.filasProductos[0].cantidad, [
      //   Validators.required
      // ])

      // No se agregan los demas porque funciona solo con los inputs donde se escriben no donde son readonly
    });
  }

  get cliente_getter() { return this.facturaForm.get('cliente'); }

  onChangeCliente(event: any) {
    this.clienteSeleccionadoID = event;
    //console.log(this.clienteSeleccionadoID);
  }

  // Recibe el obbjeto seleccionado y modifica el atributo precio del array de los articulos segun el index de ese elem
  onChangeArticulo(event: any, index: number) {
    //console.log(event);
    //console.log(index);
    const obj = event;

    const articulo = obj.nombre_articulo;
    const precio = obj.precio_articulo;

    this.filasProductos[index].articulo = articulo;
    this.filasProductos[index].precio = precio;
  }

  onChangeCantidad(event: any, index: any) {
    let cantidad = parseFloat(event.target.value);
    let precio = this.filasProductos[index].precio;
    //console.log(event.target.value);
    //console.log(index);
    this.filasProductos[index].subtotal = precio * cantidad;
  }

  add() {
    let nuevoProducto = {
      articulo: '', precio: 0, cantidad: 1, subtotal: 0
    }

    this.filasProductos.push(nuevoProducto);
    //console.log(this.filasProductos);
  }

  del(index: number) {
    //console.log(index);
    this.filasProductos.splice(index, 1);
  }

  save() {
    let objCabecera = {
      nro_factura_venta: this.nroComprobante,
      condicion_venta_venta: 'Contado',
      total_venta: this.total(),
      fecha_factura_venta: this.pipe.transform(this.hoy, 'yyyy-MM-dd'),
      monto_gravado_10: 0,
      iva_10: 0,
      monto_gravado_5: 0,
      iva_5: 0,
      exento: 0,
      id_cliente: this.clienteSeleccionadoID
    }

    console.log('Cabecera', objCabecera);

    // this.api.post('cabecera_venta', objCabecera)
    //   .subscribe(result => {
    //     this.toastr.success('Venta registrada');
    //     console.log('Cabecera result post: ', result);
    //     //this.toastr.warning(result);
    //   }, error => {
    //     console.log('Si hay error en el post: ', error);
    //     this.toastr.error('Error', error);
    //   });



    for (let a of this.filasProductos) {
      let objDetalle = {
        descripcion_detalle_venta: a.articulo,
        cant_item_detalle_venta: a.cantidad,
        subtotal_detalle_venta: a.subtotal,
        precio_detalle_venta: a.precio,
        nro_factura_venta: this.nroComprobante
      }

      // this.api.post('detalle_venta', objDetalle)
      //   .subscribe(result => {
      //     //this.toastr.success('Venta registrada');
      //     console.log('Detalle result post', result);
      //   }, error => {
      //     console.log('Si hay error en el post: ', error);
      //   });

      // Post
      console.log('Detalle', objDetalle);

    }

  }

  printToJpeg() {

    let node = <HTMLInputElement>document.getElementById('comprobante');

    htmlToImage
      .toJpeg(node)
      .then((dataUrl) => {
        var link = document.createElement('a');
        link.download = 'comprobante' + this.nroComprobante + '.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('Error al crear la imagen!', error);
      });
  }

  printToPDF() {

  }


}
