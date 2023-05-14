import { Component, OnInit, } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

// Format
import { CurrencyPipe, DatePipe } from '@angular/common'

// Error handlers
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  constructor(public api: ApiService, public toastr: ToastrService) { }
  error: any;

  usuarios: any;
  cajas: any;
  arqueos: any;

  ngOnInit(): void {
    // this.api.get('users')
    //   .pipe(
    //     catchError((error: HttpErrorResponse) => {
    //       this.error = error.message;
    //       console.log(this.error);

    //       this.toastr.error(error.message, 'Server ERROR:', {
    //         progressBar: true,
    //         positionClass: 'toast-top-full-width',
    //         disableTimeOut: true
    //       });
    //       return throwError(() => new Error('Error al cargar los datos.'));
    //     })
    //   )
    //   .subscribe(data => {
    //     let estedata = data;
    //     //console.log(estedata);
    //   });

    this.api.get('users')
      .subscribe(data => {
        this.usuarios = data;
        //console.log(this.usuarios);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })

    this.api.get('caja')
      .subscribe(data => {
        this.cajas = data;
        //console.log(this.usuarios);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })

    this.api.get('arqueo')
      .subscribe(data => {
        this.arqueos = data;
        //console.log(this.usuarios);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })


  }

  showEditModal(u: any) {
    console.log(u);
  }

  delete(u: any) {
    console.log(u);
  }

}
