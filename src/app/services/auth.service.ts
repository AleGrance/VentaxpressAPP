import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private router: Router, private toastr: ToastrService) { }

  login(user: any) {
    let body: any;
    this.apiService.post('auth', user)
      .subscribe(data => {
        body = data;
        //console.log(body);

        localStorage.setItem("token", body.token);
        localStorage.setItem("user", body.user_name);
        localStorage.setItem("id", body.user_id);

        this.router.navigate(['/dashboard']);
        this.toastr.success('Acceso correcto');
      }, error => {
        console.log(error.error);
        this.toastr.error(error.error.message);
      })
  }

  isLoggedIn() { return !!localStorage.getItem('token') };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Used by tokenInterceptorService
  getToken() {
    return localStorage.getItem('token');
  }
}
