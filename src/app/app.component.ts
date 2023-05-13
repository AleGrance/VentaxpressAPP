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
  }

  logout() {
    //this.usuarioLogeado = '';
    this.authService.logout();
  }
}
