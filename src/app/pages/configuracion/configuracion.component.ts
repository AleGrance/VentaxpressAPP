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
  usuarioEditID: any;
  usuariosCaja: any;
  roles: any;
  cajas: any;
  arqueos: any;
  billetes: any;

  tabSeleccionado: any;

  // Forms
  public usuarioForm: any;
  //public usuarioEditForm: any;
  public usuarioEditForm: any;

  public cajaForm: any;
  public cajaEditForm: any;


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

    this.usuarioEditForm = new FormGroup({
      user_name_edit: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_fullname_edit: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      // user_password_edit: new FormControl(objUsuarioEdit.us, [
      //   Validators.required,
      //   Validators.minLength(4)
      // ]),
      user_email_edit: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });

    // Form ADD Caja
    this.cajaForm = new FormGroup({
      fecha_apertura: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      fecha_cierre: new FormControl('', [
        // Validators.required,
        // Validators.minLength(4)
      ]),
      total_ventas: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      total_devoluciones: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      total_efectivo: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ])
      ,
      total_tarjeta: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ])
      ,
      total_cheques: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      total_cupones: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      cambio_inicial: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      cambio_final: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ]),
      user_id: new FormControl(0, [
        Validators.required,
        Validators.minLength(1)
      ])
    });
  }

  // Validaciones para ADD Usuario
  get name() { return this.usuarioForm.get('user_name'); }
  get fullname() { return this.usuarioForm.get('user_fullname'); }
  get password() { return this.usuarioForm.get('user_password'); }
  get email() { return this.usuarioForm.get('user_email'); }

  // Validaciones para EDIT Usuario
  get nameEdit() { return this.usuarioEditForm.get('user_name_edit'); }
  get fullnameEdit() { return this.usuarioEditForm.get('user_fullname_edit'); }
  //get passwordEdit() { return this.usuarioForm.get('user_password'); }
  get emailEdit() { return this.usuarioEditForm.get('user_email_edit'); }

  // Validaciones para ADD Caja
  get fechaApertura() { return this.cajaForm.get('fecha_apertura'); }
  get fechaCierre() { return this.cajaForm.get('fecha_cierre'); }
  get totalVentas() { return this.cajaForm.get('total_ventas'); }
  get totalDevoluciones() { return this.cajaForm.get('total_devoluciones'); }
  get totalEfectivo() { return this.cajaForm.get('total_efectivo'); }
  get totalTarjeta() { return this.cajaForm.get('total_tarjeta'); }
  get totalCheques() { return this.cajaForm.get('total_cheques'); }
  get totalCupones() { return this.cajaForm.get('total_cupones'); }
  get cambioInicial() { return this.cajaForm.get('cambio_inicial'); }
  get cambioFinal() { return this.cajaForm.get('cambio_final'); }
  get userId() { return this.cajaForm.get('user_id'); }

  submitUsuario() {
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

  submitUsuarioEdit() {
    let objUsuario = {
      user_name: this.usuarioEditForm.get('user_name_edit').value,
      user_fullname: this.usuarioEditForm.get('user_fullname_edit').value,
      user_email: this.usuarioEditForm.get('user_email_edit').value,
    }

    console.log(objUsuario);

    this.api.put('users/' + this.usuarioEditID, objUsuario)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Usuario modificado correctamente!', 'Ok');
        } else {
          this.toastr.error(result, 'Error');
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.error, `Server ERROR: ${error.status}`);
      })

  }

  submitCaja() {
    let objCaja = {
      fecha_apertura: this.cajaForm.get('fecha_apertura').value,
      fecha_cierre: this.cajaForm.get('fecha_cierre').value,
      total_ventas: this.cajaForm.get('total_ventas').value,
      total_devoluciones: this.cajaForm.get('total_devoluciones').value,
      total_efectivo: this.cajaForm.get('total_efectivo').value,
      total_tarjeta: this.cajaForm.get('total_tarjeta').value,
      total_cheques: this.cajaForm.get('total_cheques').value,
      total_cupones: this.cajaForm.get('total_cupones').value,
      cambio_inicial: this.cajaForm.get('cambio_inicial').value,
      cambio_final: this.cajaForm.get('cambio_final').value,
      user_id: this.cajaForm.get('user_id').value,

      id_estado: 1
    };

    console.log(objCaja);

    this.api.post('caja', objCaja)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Caja registrado');
          //console.log('Success', result);
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.getAllData();
          // Funcion para resetear el formulario
          this.cajaForm.reset();
        }

        if (result.status === 'error') {
          this.toastr.error(result, 'Error');
          console.log('Error', result);
        }
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })
  }

  onSelectTab(e: any) {
    console.log(e.target.id);
    this.tabSeleccionado = '';
  }

  onSelectUsuario(e: any) {
    console.log(e);
  }

  showEditUserModal(e: any) {
    //console.log(e);
    this.usuarioEditID = e.user_id;

    let objUsuarioEdit = {
      user_name: e.user_name,
      user_fullname: e.user_fullname,
      user_email: e.user_email,
    }

    this.usuarioEditForm.get('user_name_edit').setValue(objUsuarioEdit.user_name);
    this.usuarioEditForm.get('user_fullname_edit').setValue(objUsuarioEdit.user_fullname);
    this.usuarioEditForm.get('user_email_edit').setValue(objUsuarioEdit.user_email);

    //console.log(this.usuarioEditForm.value);
  }

  showEditCajaModal(u: any) {
    console.log(u);
  }

  delete(u: any) {
    console.log(u);
  }

  getAllData() {
    this.api.get('users')
      .subscribe(data => {
        this.usuarios = data;
        let usuariosCajaArray = []
        //console.log(this.usuarios);
        for (let u of this.usuarios) {
          if (u.role_id === 2) {
            usuariosCajaArray.push(u);
          }
        }
        this.usuariosCaja = usuariosCajaArray;
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })

    // this.api.get('usersCaja')
    //   .subscribe(data => {
    //     this.usuariosCaja = data;
    //     //console.log(this.usuarios);
    //   }, error => {
    //     console.log(error);
    //     this.toastr.error(error.message, `Server ERROR: ${error.status}`);
    //   })

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
        //console.log(this.cajas);
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
