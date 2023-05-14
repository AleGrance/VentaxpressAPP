import { Component, OnInit, } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  roles: any;
  cajas: any;
  arqueos: any;
  billetes: any;

  tabSeleccionado: any;

  // Forms
  public usuarioForm: any;

  ngOnInit(): void {
    this.getUsuarioLogeadoRole();
    this.getAllData();
    this.createForms();
  }

  getUsuarioLogeadoRole() {
    let role_id: any = localStorage.getItem('role_id');
    //console.log('Role ID', role_id);

    if (parseFloat(role_id) === 1) {
      //console.log('Es administrador');
      this.usuarioLogeadoRole = true;
    } else {
      //console.log('No es administrador');
      this.usuarioLogeadoRole = false;
    }
  }

  createForms() {
    // Form ADD Usuario
    this.usuarioForm = new FormGroup({
      user_name: new FormControl('user', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_fullname: new FormControl('Usuario', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_password: new FormControl('12345', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_email: new FormControl('user@ventaxpress.com', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  // Validaciones para ADD Usuario
  get name() { return this.usuarioForm.get('user_name'); }
  get fullname() { return this.usuarioForm.get('user_fullname'); }
  get password() { return this.usuarioForm.get('user_password'); }
  get email() { return this.usuarioForm.get('user_email'); }

  submit() {
    let objUsuario = {
      user_name: this.usuarioForm.get('user_name').value,
      user_fullname: this.usuarioForm.get('user_fullname').value,
      user_password: this.usuarioForm.get('user_password').value,
      user_email: this.usuarioForm.get('user_email').value,
      role_id: 1
    };

    console.log(objUsuario);

    this.api.post('users', objUsuario)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Usuario registrado');
          //console.log('Success', result);
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.getAllData();
          // Funcion para resetear el formulario
          this.usuarioForm.reset();
        }

        if (result.status === 'error') {
          this.toastr.error(result.body[0].message, 'Error');
          //console.log('Error', result);
        }

        //this.usuarios = data;
        console.log(data);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })
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

  getAllData() {
    this.api.get('users')
      .subscribe(data => {
        this.usuarios = data;
        //console.log(this.usuarios);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })

    this.api.get('roles')
      .subscribe(data => {
        this.roles = data;
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

    this.api.get('billete')
      .subscribe(data => {
        this.billetes = data;
        //console.log(this.billetes);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })
  }

}
