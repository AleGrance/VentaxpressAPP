import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEsPy from '@angular/common/locales/es-PY';

import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
i: number = 0;


  constructor(public api: ApiService, private authService: AuthService) {
    registerLocaleData(localeEsPy);
  }
  // Icons
  faTrash = faTrash;
  //public contribuyentes: any;
  public clientes: any;
  public articulos: any;
  //public proveedores: any;
  //public fullData: number[] = [];

  public filasProductos = [
    { precio: 0, cantidad: 1 }
  ]

  // El formulario del registro de la factura
  public facturaForm: any;

  // Declaracion de variable tipo funcion flecha para obtener el total con cada cambio
  public total = () => {
    var total = 0;

    for(let p of this.filasProductos) {
      total += p.precio * p.cantidad;
    }

    return total;
  }

  ngOnInit(): void {

    this.api.get("cliente")
      .pipe(map(data => {
        this.clientes = data;
        //this.fullData.push(this.contribuyentes.length);
        //this.getCliente();
        //console.log(this.clientes);
      }))
      .subscribe()

    this.api.get("articulo")
      .pipe(map(data => {
        this.articulos = data;
        //this.fullData.push(this.contribuyentes.length);
        //this.getCliente();
        //console.log(this.articulos);
      }))
      .subscribe()

    //this.createChart();

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
    console.log(event);
  }

  onChangeArticulo(event: any, index: number) {
    //console.log(event);
    //console.log(index);
    const obj = event;
    const precio = obj.precio_articulo;
    this.filasProductos[index].precio = precio;
  }

  add() {
    let nuevoProducto = {
      precio: 0, cantidad: 1
    }

    this.filasProductos.push(nuevoProducto);
    console.log(this.filasProductos);
  }

  del(index: number) {
    console.log(index);
    this.filasProductos.splice(index, 1);
  }

  // getCliente() {
  //   this.api.get("cliente")
  //     .pipe(map(data => {
  //       this.clientes = data;
  //       this.fullData.push(this.clientes.length);
  //       this.getProveedor();
  //     }))
  //     .subscribe()
  // }

  // getProveedor() {
  //   this.api.get("proveedor")
  //     .pipe(map(data => {
  //       this.proveedores = data;
  //       this.fullData.push(this.proveedores.length);
  //       this.createChart();
  //     }))
  //     .subscribe()
  // }

  // createChart() {
  //   const canvas = ((<HTMLCanvasElement>document.getElementById("myChart")));
  //   const context = ((<HTMLCanvasElement>document.getElementById("myChart")).getContext('2d'));
  //   const myChart = new Chart(canvas, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Contribuyentes', 'Clientes', 'Proveedores'],
  //       datasets: [{
  //         label: '# de Registros',
  //         data: this.fullData,
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255, 99, 132, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: false,
  //       scales: {
  //         y: {

  //         }
  //       }
  //     }
  //   });

  // }

}
