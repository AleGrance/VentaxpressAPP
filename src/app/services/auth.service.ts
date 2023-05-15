import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
// Error handlers
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService, private router: Router, private toastr: ToastrService) { }

  login(user: any) {
    let body: any;
    this.api.post('auth', user)
      .subscribe(data => {
        body = data;
        //console.log(body);

        localStorage.setItem("token", body.token);
        localStorage.setItem("user", body.user_fullname);
        localStorage.setItem("user_id", body.user_id);
        localStorage.setItem("role_id", body.role_id);

        this.router.navigate(['/dashboard']);
        this.toastr.success('Acceso correcto');
      }, error => {
        if (error.status === 0) {
          this.toastr.error(error.message, `Server ERROR: ${error.status}`);
        } else {
          this.toastr.error(error.error.message, `Server ERROR: ${error.status}`);
        }
        console.log(error);
      })
  }

  isLoggedIn() { return !!localStorage.getItem('token') };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role_id');
    localStorage.removeItem('id_caja');
    this.router.navigate(['/login']);
  }

  // Used by tokenInterceptorService
  getToken() {
    return localStorage.getItem('token');
  }
}
