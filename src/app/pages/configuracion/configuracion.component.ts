import { Component, OnInit, } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Format
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common'
import localeEsPy from '@angular/common/locales/es-PY';

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

  constructor(public api: ApiService, public toastr: ToastrService) {
    registerLocaleData(localeEsPy);
  }
  // Icons
  faPlus = faPlus;
  // Format
  pipe = new DatePipe('en-US');

  error: any;

  usuarioLogeadoRole: boolean = false;
  usuarioLogeadoId: any;
  cajaLogeadoId: any;

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
  public usuarioEditForm: any;

  public cajaForm: any;
  public cajaEditForm: any;

  public billeteForm: any;
  public billeteEditForm: any;

  public arqueoForm: any;
  public arqueoEditForm: any;


  ngOnInit(): void {
    this.usuarioLogeadoId = localStorage.getItem('user_id');
    this.cajaLogeadoId = localStorage.getItem('id_caja');

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
      ]),
      role_id: new FormControl('Seleccione un rol', [
        Validators.required
      ])
    });

    // Form EDIT Usuario
    this.usuarioEditForm = new FormGroup({
      user_name_edit: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_fullname_edit: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      user_password_edit: new FormControl('', [
        //Validators.required,
        //Validators.minLength(4)
      ]),
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

    // Form ADD Arqueo
    this.arqueoForm = new FormGroup({
      cantidad: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      total: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      fecha: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      id_billete: new FormControl('Seleccione un billete', [
        Validators.required
      ])
    });

    // Form ADD Billete
    this.billeteForm = new FormGroup({
      denominacion: new FormControl('Billete de 10.000', [
        Validators.required,
        Validators.minLength(2)
      ]),
      valor: new FormControl(10000, [
        Validators.required,
        Validators.minLength(2)
      ])
    });
  }

  // Validaciones para ADD Usuario
  get name() { return this.usuarioForm.get('user_name'); }
  get fullname() { return this.usuarioForm.get('user_fullname'); }
  get password() { return this.usuarioForm.get('user_password'); }
  get email() { return this.usuarioForm.get('user_email'); }
  get roleId() { return this.usuarioForm.get('role_id'); }

  // Validaciones para EDIT Usuario
  get nameEdit() { return this.usuarioEditForm.get('user_name_edit'); }
  get fullnameEdit() { return this.usuarioEditForm.get('user_fullname_edit'); }
  get passwordEdit() { return this.usuarioForm.get('user_password'); }
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

  // Validaciones para ADD Arqueo
  get cantidad() { return this.arqueoForm.get('cantidad'); }
  get total() { return this.arqueoForm.get('total'); }
  get fecha() { return this.arqueoForm.get('fecha'); }
  get id_billete() { return this.arqueoForm.get('id_billete'); }

  // Validaciones para ADD Billete
  get denominacion() { return this.billeteForm.get('denominacion'); }
  get valor() { return this.billeteForm.get('valor'); }

  // ADD Usuario
  submitUsuario() {
    let objUsuario = {
      user_name: this.usuarioForm.get('user_name').value,
      user_fullname: this.usuarioForm.get('user_fullname').value,
      user_password: this.usuarioForm.get('user_password').value,
      user_email: this.usuarioForm.get('user_email').value,

      role_id: parseFloat(this.usuarioForm.get('role_id').value),
    };

    //console.log(objUsuario);

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
  // EDIT Usuario
  submitUsuarioEdit() {
    let objUsuario = {
      user_name: this.usuarioEditForm.get('user_name_edit').value,
      user_password: this.usuarioEditForm.get('user_password_edit').value,
      user_fullname: this.usuarioEditForm.get('user_fullname_edit').value,
      user_email: this.usuarioEditForm.get('user_email_edit').value,
    }

    //console.log(objUsuario);

    this.api.put('users/' + this.usuarioEditID, objUsuario)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Usuario modificado correctamente!', 'Ok');
          this.getAllData();
        } else {
          this.toastr.error(result, 'Error');
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.error, `Server ERROR: ${error.status}`);
      })

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

  // ADD Caja
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
  // UPD Caja - Estado
  updCaja(e: any, u: any) {
    let hoy = new Date();
    let hoyFormated = this.pipe.transform(hoy, 'yyyy-MM-dd HH:mm');

    let objCaja = {
      id_estado: 1,
      fecha_cierre: hoyFormated
    };

    let estado = e.target.id;
    let cajaId = u.id_caja;

    //console.log(e.target.id);
    //console.log(u.id_caja);

    if (estado === 'cerrar') {
      objCaja.id_estado = 2;
    } else if (estado === 'bloquear') {
      objCaja.id_estado = 3;
    }

    this.api.put('caja/' + cajaId, objCaja)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.getAllData();
          this.toastr.success('Estado actualizado correctamente!', 'Ok');
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })

    //console.log(objCaja);
  }

  // ADD Billete
  submitBillete() {
    let objBillete = {
      denominacion: this.billeteForm.get('denominacion').value,
      valor: this.billeteForm.get('valor').value
    };

    //console.log(objBillete);

    this.api.post('billete', objBillete)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Billete registrado');
          //console.log('Success', result);
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.getAllData();
          // Funcion para resetear el formulario
          this.billeteForm.reset();
        }

        if (result.status === 'error') {
          this.toastr.error(result, 'Error');
          console.log('Error', result);
        }
        //console.log(data);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })
  }

  // ADD Billete
  submitArqueo() {
    let objArqueo = {
      cantidad: this.arqueoForm.get('cantidad').value,
      total: this.arqueoForm.get('total').value,
      fecha: this.arqueoForm.get('fecha').value,
      id_billete: this.arqueoForm.get('id_billete').value,

      id_caja: this.cajaLogeadoId,
      user_id: this.usuarioLogeadoId
    };

    console.log(objArqueo);

    this.api.post('arqueo', objArqueo)
      .subscribe(data => {
        let result: any = data;

        if (result.status === 'success') {
          this.toastr.success('Arqueo registrado');
          //console.log('Success', result);
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.getAllData();
          // Funcion para resetear el formulario
          this.arqueoForm.reset();
        }

        if (result.status === 'error') {
          this.toastr.error(result, 'Error');
          console.log('Error', result);
        }
        //console.log(data);
      }, error => {
        console.log(error);
        this.toastr.error(error.message, `Server ERROR: ${error.status}`);
      })
  }

  showEditBilleteModal(e: any) {
    console.log(e);
  }

  showEditArqueoModal(e: any) {
    console.log(e);
  }

  onSelectTab(e: any) {
    console.log(e.target.id);
    this.tabSeleccionado = '';
  }

  onSelectUsuario(e: any) {
    console.log(e);
  }

  onSelectRole(e: any) {
    console.log(e);
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
        console.log(this.arqueos);
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
