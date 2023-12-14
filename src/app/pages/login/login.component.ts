import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public user = {
    user_name: "",
    user_password: "",
  };

  public mostrarOcultarText = "Mostrar contraseña";

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    //console.log(this.authService.isLoggedIn());
    // Para evitar mostrar el navbar al retroceder hacia el login sin hacer clic en Salir
    this.authService.logout();
  }

  login() {
    this.authService.login(this.user)
  }

  showPassword() {
    const typePass = ((<HTMLInputElement>document.getElementById("password")).type);

    if (typePass === "text") {
      ((<HTMLInputElement>document.getElementById("password")).type) = "password";
    } else if (typePass === "password") {
      ((<HTMLInputElement>document.getElementById("password")).type) = "text";
    }

  }

}
