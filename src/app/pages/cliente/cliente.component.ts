import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  // El listado de clientes
  public clientes: any;
  public clienteForm: any;

  public clienteEditarForm: any;
  public clienteEditarID: any;

  // Para el formulario de editar cliente
  public clienteEditar = {
    razon_social_cliente: "",
    ruc_cliente: "",
  };

  constructor(public api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.clienteForm = new FormGroup({
      razon: new FormControl("", [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc: new FormControl("", [
        Validators.required,
        Validators.minLength(4)
      ])
    });

    this.clienteEditarForm = new FormGroup({
      razon_form: new FormControl(this.clienteEditar.razon_social_cliente, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_form: new FormControl(this.clienteEditar.ruc_cliente, [
        Validators.required,
        Validators.minLength(4)
      ])
    });

    // Trae datos del api
    this.api.get('cliente')
      .pipe(map(data => {
        this.clientes = data;
        //console.log(this.clientes);
      }))
      .subscribe()

  }

  // Validaciones para Add cliente
  get razon() { return this.clienteForm.get('razon'); }
  get ruc() { return this.clienteForm.get('ruc'); }

  // Validaciones para Edit cliente
  get razon_getter() { return this.clienteEditarForm.get('razon_form'); }
  get ruc_getter() { return this.clienteEditarForm.get('ruc_form'); }

  // Submit para Add cliente
  submit() {

    const razon = ((<HTMLInputElement>document.getElementById("razon")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("ruc")).value);

    let newCliente = {
      razon_social_cliente: razon,
      ruc_cliente: ruc,
    }

    this.api.post('cliente', newCliente)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Cliente registrado');
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.ngOnInit();
          // Funcion para resetear el formulario
          this.clienteForm.reset();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      }, error => {
        console.log('Si hay error en el post: ', error);
      });
  }

  // Submit para Edit cliente
  submitEdit() {
    const razon = ((<HTMLInputElement>document.getElementById("razonId")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("rucId")).value);

    let editCliente = {
      razon_social_cliente: razon,
      ruc_cliente: ruc,
    }

    this.api.put('cliente/' + this.clienteEditarID, editCliente)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Cliente modificado');
          // Llama a la funcion onInit que resetea el formulario
          this.ngOnInit();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      });
  }

  // Se ejecuta al seleccionar la opcion factura compra
  clienteSeleccionado(value: any) {

  }

  // Se llama al modal para editar el cliente
  showEditModal(value: any) {

    this.clienteEditarID = value.id_cliente;

    this.clienteEditar = {
      razon_social_cliente: value.razon_social_cliente,
      ruc_cliente: value.ruc_cliente
    }

    console.log("El elemento a editar en objeto", this.clienteEditar, "Tiene ID: ", this.clienteEditarID);

    // Se crea el objeto formgroup con los datos del elemento seleccionado
    this.clienteEditarForm = new FormGroup({
      razon_form: new FormControl(this.clienteEditar.razon_social_cliente, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_form: new FormControl(this.clienteEditar.ruc_cliente, [
        Validators.required,
        Validators.minLength(4)
      ])
    });

  }

  delete(value: any) {
    const id = value.id_cliente
    console.log(id);
    this.api.delete('cliente/' + id)
      .subscribe(result => {
        console.log('result delete: ', result);
        for (let u of this.clientes) {
          if (u.id_cliente === id) {
            this.clientes.splice(this.clientes.indexOf(u), 1);
          }
        }
      });
  }



}
