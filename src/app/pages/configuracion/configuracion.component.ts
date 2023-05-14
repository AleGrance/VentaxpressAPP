import { Component, OnInit, } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

// Format
import { CurrencyPipe, DatePipe } from '@angular/common'

// Icons
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
  // Icons
  faPlus = faPlus;

  error: any;

  usuarioLogeadoRole: boolean = false;

  usuarios: any;
  cajas: any;
  arqueos: any;

  tabSeleccionado: any;

  ngOnInit(): void {
    this.getUsuarioLogeadoRole();
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

  getUsuarioLogeadoRole() {
    let role_id: any = localStorage.getItem('role_id');
    console.log('Role ID', role_id);

    if (parseFloat(role_id) === 1) {
      //console.log('Es administrador');
      this.usuarioLogeadoRole = true;
    } else {
      //console.log('No es administrador');
      this.usuarioLogeadoRole = false;
    }
  }

  onSelectTab(e: any) {
    console.log(e.target.id);
    this.tabSeleccionado = '';
  }

  showEditModal(u: any) {
    console.log(u);
  }

  delete(u: any) {
    console.log(u);
  }

}
