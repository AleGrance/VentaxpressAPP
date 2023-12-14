import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  // Icons
  faPlus = faPlus;
  // El listado de proveedores
  public proveedores: any;
  public proveedorForm: any;

  // Para el formulario de crear nuevo proveedor
  public proveedorNuevo = {
    nom_proveedor: 'Nombre',
    ruc_proveedor: '12345',
    timbrado_proveedor: '12345678',
  };

  public proveedorEditarForm: any;
  public proveedorEditarID: any;

  // Para el formulario de editar proveedor
  public proveedorEditar = {
    nom_proveedor: "",
    ruc_proveedor: "",
    timbrado_proveedor: "",
  };

  constructor(public api: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.proveedorForm = new FormGroup({
      nombre: new FormControl(this.proveedorNuevo.nom_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc: new FormControl(this.proveedorNuevo.ruc_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado: new FormControl(this.proveedorNuevo.timbrado_proveedor, [
        Validators.required,
        Validators.minLength(8)
      ])
    });

    this.proveedorEditarForm = new FormGroup({
      nombre_form: new FormControl(this.proveedorEditar.nom_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_form: new FormControl(this.proveedorEditar.ruc_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado_form: new FormControl(this.proveedorEditar.timbrado_proveedor, [
        Validators.required,
        Validators.minLength(5)
      ])
    });

    // Trae datos del api
    this.api.get('proveedor')
      .pipe(map(data => {
        this.proveedores = data;
      }))
      .subscribe()

    // Trae datos del api
    /*this.api.get('people')
      .pipe(map(data => {
        this.proveedores = data;
        console.log('Pokemones: ', this.proveedores);
      }))
      .subscribe()*/
  }

  // Validaciones para Add proveedor
  get nombre() { return this.proveedorForm.get('nombre'); }
  get ruc() { return this.proveedorForm.get('ruc'); }
  get timbrado() { return this.proveedorForm.get('timbrado'); }

  // Validaciones para Edit proveedor
  get nombre_getter() { return this.proveedorEditarForm.get('nombre_form'); }
  get ruc_getter() { return this.proveedorEditarForm.get('ruc_form'); }
  get timbrado_getter() { return this.proveedorEditarForm.get('timbrado_form'); }

  submit() {

    const nombre = ((<HTMLInputElement>document.getElementById("nombre")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("ruc")).value);
    const timbrado = ((<HTMLInputElement>document.getElementById("timbrado")).value);

    let newProveedor = {
      nom_proveedor: nombre,
      ruc_proveedor: ruc,
      timbrado_proveedor: timbrado,
    }

    this.api.post('proveedor', newProveedor)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Proveedor registrado');
          // Llama a la funcion onInit que agrega a la lista el cliente registrado
          this.ngOnInit();
          // Funcion para resetear el formulario
          this.proveedorForm.reset();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      }, error => {
        console.log('Si hay error en el post: ', error);
      });

    //console.log(nombre, ruc, timbrado);

  }

  // Submit para Edit proveedor
  submitEdit() {
    const nombre = ((<HTMLInputElement>document.getElementById("nombreId")).value);
    const ruc = ((<HTMLInputElement>document.getElementById("rucId")).value);
    const timbrado = ((<HTMLInputElement>document.getElementById("timbradoId")).value);

    let editProveedor = {
      nom_proveedor: nombre,
      ruc_proveedor: ruc,
      timbrado_proveedor: timbrado
    }

    this.api.put('proveedor/' + this.proveedorEditarID, editProveedor)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Proveedor modificado');
          // Llama a la funcion onInit que resetea el formulario
          this.ngOnInit();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      });
  }

  // Se llama al modal para editar el proveedor
  showEditModal(value: any) {

    this.proveedorEditarID = value.id_proveedor;

    this.proveedorEditar = {
      nom_proveedor: value.nom_proveedor,
      ruc_proveedor: value.ruc_proveedor,
      timbrado_proveedor: value.timbrado_proveedor
    }

    console.log("El elemento a editar en objeto", this.proveedorEditar, "Tiene ID: ", this.proveedorEditarID);

    // Se crea el objeto formgroup con los datos del elemento seleccionado
    this.proveedorEditarForm = new FormGroup({
      nombre_form: new FormControl(this.proveedorEditar.nom_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      ruc_form: new FormControl(this.proveedorEditar.ruc_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ]),
      timbrado_form: new FormControl(this.proveedorEditar.timbrado_proveedor, [
        Validators.required,
        Validators.minLength(4)
      ])
    });

  }

  delete(value: any) {
    const id = value.id_proveedor
    console.log(id);
    this.api.delete('proveedor/' + id)
      .subscribe(result => {
        console.log('result delete: ', result);
        for (let u of this.proveedores) {
          if (u.id_proveedor === id) {
            this.proveedores.splice(this.proveedores.indexOf(u), 1);
          }
        }
      });
  }

}
