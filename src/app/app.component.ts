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
  usuarioLogeado = localStorage.getItem('user');

  constructor(public api: ApiService, public authService: AuthService) {

  }

  ngOnInit() {
    this.title = this.api.url;
  }

  logout() {
    this.authService.logout();
  }
}
