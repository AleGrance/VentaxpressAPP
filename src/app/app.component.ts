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

  constructor(public api: ApiService, public authService: AuthService) {

  }

  usuarioLogueado() {
    return localStorage.getItem('user')
  };

  ngOnInit() {
    this.title = this.api.url;
  }

  logout() {
    this.authService.logout();
  }
}
