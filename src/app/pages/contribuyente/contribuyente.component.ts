import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contribuyente',
  templateUrl: './contribuyente.component.html',
  styleUrls: ['./contribuyente.component.css']
})
export class ContribuyenteComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  // El listado de contribuyentes
  public contribuyentes: any;
  public contribuyenteForm: any;

  // Para el formulario de crear nuevo contribuyente
  public contribuyenteNuevo = {
    razon_social_contribuyente: 'Nombre',
    ruc_contribuyente: '4555888-5',
    timbrado: '12345',
    dir_contribuyente: 'Asunción',
    tel_contribuyente: '0981222888',
    email_contribuyente: 'correo@gmail.com',
  };
  
  public contribuyenteEditarForm: any;
  public contribuyenteEditarID: any;

  // Para el formulario de editar contribuyente
  public contribuyenteEditar = {
    razon_edit: "",
    ruc_edit: "",
    timbrado_edit: "",
    dir_edit: "",
    tel_edit: "",
    email_edit: "",
  }

  constructor(public api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {

    // Formulario de Add contribuyente
    this.contribuyenteForm = new FormGroup({
      razon: new FormControl(this.contribuyenteNuevo.razon_social_contribuyente, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc: new FormControl(this.contribuyenteNuevo.ruc_contribuyente, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado: new FormControl(this.contribuyenteNuevo.timbrado, [
        Validators.required,
        Validators.minLength(4)
      ]),
      direccion: new FormControl(this.contribuyenteNuevo.dir_contribuyente, [
        Validators.required,
        Validators.minLength(5)
      ]),
      tel: new FormControl(this.contribuyenteNuevo.tel_contribuyente, [
        Validators.required,
        Validators.minLength(5)
      ]),
      email: new FormControl(this.contribuyenteNuevo.email_contribuyente, [
        Validators.required,
        Validators.minLength(5),
        Validators.email
      ])
    });

    // Formulario para Editar / Se carga el objeto vacio primero porque da error si no encuentra el formgroup creado
    this.contribuyenteEditarForm = new FormGroup({
      razon_edit: new FormControl(this.contribuyenteEditar.razon_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_edit: new FormControl(this.contribuyenteEditar.ruc_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado_edit: new FormControl(this.contribuyenteEditar.timbrado_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      direccion_edit: new FormControl(this.contribuyenteEditar.dir_edit, [
        Validators.required,
        Validators.minLength(5)
      ]),
      tel_edit: new FormControl(this.contribuyenteEditar.tel_edit, [
        Validators.required,
        Validators.minLength(5)
      ]),
      email_edit: new FormControl(this.contribuyenteEditar.email_edit, [
        Validators.required,
        Validators.minLength(5),
        Validators.email
      ])
    });

    // Trae datos del api
    this.api.get('contribuyente')
      .pipe(map(data => {
        this.contribuyentes = data;
        //console.log(this.contribuyentes);
      }))
      .subscribe()
  }

  // Validaciones para Add contribuyente
  get razon() { return this.contribuyenteForm.get('razon'); }
  get ruc() { return this.contribuyenteForm.get('ruc'); }
  get timbrado() { return this.contribuyenteForm.get('timbrado'); }
  get direccion() { return this.contribuyenteForm.get('direccion'); }
  get tel() { return this.contribuyenteForm.get('tel'); }
  get email() { return this.contribuyenteForm.get('email'); }

  // Validaciones para Edit contribuyente
  get razon_edit() { return this.contribuyenteEditarForm.get('razon_edit'); }
  get ruc_edit() { return this.contribuyenteForm.get('ruc_edit'); }
  get timbrado_edit() { return this.contribuyenteForm.get('timbrado_edit'); }
  get direccion_edit() { return this.contribuyenteForm.get('direccion_edit'); }
  get tel_edit() { return this.contribuyenteForm.get('tel_edit'); }
  get email_edit() { return this.contribuyenteForm.get('email_edit'); }

  // Submit para Add contribuyente
  submit() {

    const razon = ((<HTMLInputElement>document.getElementById("razon")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("ruc")).value);
    const timbrado = ((<HTMLInputElement>document.getElementById("timbrado")).value);
    const direccion = ((<HTMLInputElement>document.getElementById("direccion")).value);
    const tel = ((<HTMLInputElement>document.getElementById("tel")).value);
    const email = ((<HTMLInputElement>document.getElementById("email")).value);

    let newContribuyente = {
      razon_social_contribuyente: razon,
      ruc_contribuyente: ruc,
      timbrado: timbrado,
      dir_contribuyente: direccion,
      tel_contribuyente: tel,
      email_contribuyente: email,
    }

    this.api.post('contribuyente', newContribuyente)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Contribuyente registrado');
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.ngOnInit();
          // Funcion para resetear el formulario
          this.contribuyenteForm.reset();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      }, error => {
        console.log('Si hay error en el post: ', error);
      });
  }

  // Submit para Edit contribuyente
  submitEdit() {

    const razon = ((<HTMLInputElement>document.getElementById("razon_edit")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("ruc_edit")).value);
    const timbrado = ((<HTMLInputElement>document.getElementById("timbrado_edit")).value);
    const direccion = ((<HTMLInputElement>document.getElementById("direccion_edit")).value);
    const tel = ((<HTMLInputElement>document.getElementById("tel_edit")).value);
    const email = ((<HTMLInputElement>document.getElementById("email_edit")).value);

    let editContribuyente = {
      razon_social_contribuyente: razon,
      ruc_contribuyente: ruc,
      timbrado: timbrado,
      dir_contribuyente: direccion,
      tel_contribuyente: tel,
      email_contribuyente: email,
    }

    this.api.put('contribuyente/' + this.contribuyenteEditarID, editContribuyente)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Contribuyente modificado');
          // Llama a la funcion onInit que resetea el formulario
          this.ngOnInit();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      });

    //console.log(razon, ruc, timbrado);

  }

  // Submit para Delete contribuyente
  delete(value: any) {
    const id = value.id_contribuyente
    console.log(id);
    this.api.delete('contribuyente/' + id)
      .subscribe(result => {
        console.log('result delete: ', result);
        for (let u of this.contribuyentes) {
          if (u.id_contribuyente === id) {
            this.contribuyentes.splice(this.contribuyentes.indexOf(u), 1);
          }
        }
      });
  }

  // Se llama al modal para editar el contribuyente
  showEditModal(value: any) {
    console.log("El elemento seleccionado", value);
    this.contribuyenteEditarID = value.id_contribuyente;

    this.contribuyenteEditar = {
      razon_edit: value.razon_social_contribuyente,
      ruc_edit: value.ruc_contribuyente,
      timbrado_edit: value.timbrado,
      dir_edit: value.dir_contribuyente,
      tel_edit: value.tel_contribuyente,
      email_edit: value.email_contribuyente
    }

    console.log("El elemento a editar en objeto", this.contribuyenteEditar, "Tiene ID: ", this.contribuyenteEditarID);

    // Se crea el objeto formgroup con los datos del elemento seleccionado
    this.contribuyenteEditarForm = new FormGroup({
      razon_edit: new FormControl(this.contribuyenteEditar.razon_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_edit: new FormControl(this.contribuyenteEditar.ruc_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado_edit: new FormControl(this.contribuyenteEditar.timbrado_edit, [
        Validators.required,
        Validators.minLength(4)
      ]),
      direccion_edit: new FormControl(this.contribuyenteEditar.dir_edit, [
        Validators.required,
        Validators.minLength(5)
      ]),
      tel_edit: new FormControl(this.contribuyenteEditar.tel_edit, [
        Validators.required,
        Validators.minLength(5)
      ]),
      email_edit: new FormControl(this.contribuyenteEditar.email_edit, [
        Validators.required,
        Validators.minLength(5),
        Validators.email
      ])
    });

  }
}
