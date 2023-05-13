import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(public api: ApiService, public authService: AuthService) {

  }

  usuarioLogeado() {
    return localStorage.getItem('user')
  };

  ngOnInit() {
    this.title = this.api.url;
    this.usuarioLogeadoRole();
  }

  usuarioLogeadoRole() {
    let role_id: any = localStorage.getItem('role_id');
    //console.log('Role ID', role_id);

    if (parseFloat(role_id) === 1) {
      //console.log('Es administrador');
      return true;
    } else {
      //console.log('No es administrador');
      return false;
    }
  }

  logout() {
    //this.usuarioLogeado = '';
    this.authService.logout();
  }
}
