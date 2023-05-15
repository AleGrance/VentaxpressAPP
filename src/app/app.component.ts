import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from './services/auth.service';

import { map } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  usuarioLogueado: any;
  cajaId: any;


  constructor(public api: ApiService, public authService: AuthService) {

  }

  usuarioLogeado() {
    return localStorage.getItem('user')
  };

  ngOnInit() {
    this.title = this.api.url;
    // Se obtiene el ID de la caja para poder acceder al nav de Reporte y pasar por routerlink el param para ver lo de esa caja
    this.usuarioLogueado = localStorage.getItem('id');
    this.checkCaja();
  }

  checkCaja() {
    this.api.get("cajaByUser/" + this.usuarioLogueado)
      .pipe(map(data => {
        const result: any = data;

        if (result.status === null) {
          //this.cajaExist = false;
        } else {
          this.cajaId = result.body.id_caja;
          console.log('Caja Id desde app component', this.cajaId);
        }
      }))
      .subscribe()


  }

  // usuarioLogeadoRole() {
  //   let role_id: any = localStorage.getItem('role_id');
  //   //console.log('Role ID', role_id);

  //   if (parseFloat(role_id) === 1) {
  //     //console.log('Es administrador');
  //     return true;
  //   } else {
  //     //console.log('No es administrador');
  //     return false;
  //   }
  // }

  logout() {
    //this.usuarioLogeado = '';
    this.authService.logout();
  }
}
