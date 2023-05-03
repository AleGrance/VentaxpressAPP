import { Component, OnInit } from '@angular/core';
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

  constructor(public api: ApiService, private authService: AuthService) { }

  public contribuyentes: any;
  public clientes: any;
  public proveedores: any;
  public fullData: number[] = [];

  ngOnInit(): void {
    this.api.get("contribuyente")
      .pipe(map(data => {
        this.contribuyentes = data;
        this.fullData.push(this.contribuyentes.length);
        this.getCliente();
      }))
      .subscribe()

      //this.createChart();

      // Checks if user is logged in
      //console.log(this.authService.getToken());
  }

  getCliente() {
    this.api.get("cliente")
      .pipe(map(data => {
        this.clientes = data;
        this.fullData.push(this.clientes.length);
        this.getProveedor();
      }))
      .subscribe()
  }

  getProveedor() {
    this.api.get("proveedor")
      .pipe(map(data => {
        this.proveedores = data;
        this.fullData.push(this.proveedores.length);
        this.createChart();
      }))
      .subscribe()
  }

  createChart() {
    const canvas = ((<HTMLCanvasElement>document.getElementById("myChart")));
    const context = ((<HTMLCanvasElement>document.getElementById("myChart")).getContext('2d'));
    const myChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Contribuyentes', 'Clientes', 'Proveedores'],
        datasets: [{
          label: '# de Registros',
          data: this.fullData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {

          }
        }
      }
    });

  }

}
