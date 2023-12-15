import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

// Format
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEsPy from '@angular/common/locales/es-PY';
// Icons
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
// Datatables directive
import { DataTableDirective } from 'angular-datatables';


interface ServerResponse {
  recordsTotal: number;
  recordsFiltered: number;
  data: any[];
}

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  dtOptions: any = {};

  // Icons
  faPlus = faPlus;
  faTrash = faTrash;

  // El listado de registros
  public articulos: any;
  public articuloForm: any;

  // Para el formulario de crear nuevo
  public articuloNuevo = {
    nombre_articulo: 'Cheetos',
    descri_artiulo: 'Cheetos Clasic',
    costo_artiulo: 12000,
    precio_artiulo: 15000,
    cant_disponible_articulo: '12345',
    id_proveedor: 1
  };

  public articuloEditarForm: any;
  public articuloEditarID: any;

  public tablaDibujada: any;

  // Para el formulario de editar
  public articuloEditar = {
    nombre_articulo: "",
    descri_articulo: "",
    costo_articulo: 0,
    precio_articulo: 0,
    cant_disponible_articulo: 0,
    id_proveedor: 1,
  }

  constructor(public api: ApiService, private toastr: ToastrService, private http: HttpClient) {
    registerLocaleData(localeEsPy);
  }

  ngOnInit(): void {
    // Formulario de Add
    this.articuloForm = new FormGroup({
      nombre: new FormControl(this.articuloNuevo.nombre_articulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      descri: new FormControl(this.articuloNuevo.descri_artiulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      costo: new FormControl(this.articuloNuevo.costo_artiulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      precio: new FormControl(this.articuloNuevo.precio_artiulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      cantidad: new FormControl(this.articuloNuevo.cant_disponible_articulo, [
        Validators.required,
        Validators.minLength(1),
        Validators.min(1)
      ])
    });

    // Formulario para Editar / Se carga el objeto vacio primero porque da error si no encuentra el formgroup creado
    this.articuloEditarForm = new FormGroup({
      nombre_form: new FormControl(this.articuloEditar.nombre_articulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      descri_form: new FormControl(this.articuloEditar.descri_articulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      costo_form: new FormControl(this.articuloEditar.costo_articulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      precio_form: new FormControl(this.articuloEditar.precio_articulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      cantidad_form: new FormControl(this.articuloEditar.cant_disponible_articulo, [
        Validators.required,
        Validators.minLength(1),
        Validators.min(1)
      ])
    });

    // Llenar el datatable de datos
    this.cargarTabla();
  }

  cargarTabla() {
    console.log('Se cargar la tabla');
    this.dtOptions = {
      language: {
        url: "../../assets/i18/Spanish.json"
      },
      serverSide: true,     // Set the flag
      autoWidth: false,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'asc']],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http
          .post<ServerResponse>(this.api.url + "/articuloFiltered", Object.assign(dataTablesParameters)).subscribe(resp => {
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },

      columns: [{
        title: 'Articulo',
        data: 'nombre_articulo'
      }, {
        title: 'Descripción',
        data: 'descri_articulo'
      }, {
        title: 'Precio',
        data: 'precio_articulo',
        render: function (data: any) {
          // Agregar separador de miles al valor
          return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      },
      {
        title: 'Proveedor',
        data: 'Proveedor.nom_proveedor'
      },
      {
        title: 'Estado',
        data: 'Estado.descripcion_estado'
      },
      {
        title: 'Acciones',
        data: null,
        defaultContent: `
        <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
          <button id="btn_modificar" type="button" class="btn btn-warning" data-toggle="modal" data-target="#editModal">Modificar</button>
        </div>
        `,
      }
      ],

      //select: true,

      // Se agregan las funciones de los botones
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        $('#btn_modificar', row).off('click');
        $('#btn_modificar', row).on('click', () => {
          self.showEditModal(data);
        });

        return row;
      }
    };

  }

  reloadTabla() {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
    }
  }

  // Validaciones para Add
  get nombre() { return this.articuloForm.get('nombre'); }
  get descri() { return this.articuloForm.get('descri'); }
  get costo() { return this.articuloForm.get('costo'); }
  get precio() { return this.articuloForm.get('precio'); }
  get cantidad() { return this.articuloForm.get('cantidad'); }

  // Validaciones para Edit
  get nombre_getter() { return this.articuloEditarForm.get('nombre_form'); }
  get descri_getter() { return this.articuloEditarForm.get('descri_form'); }
  get costo_getter() { return this.articuloEditarForm.get('costo_form'); }
  get precio_getter() { return this.articuloEditarForm.get('precio_form'); }
  get cantidad_getter() { return this.articuloEditarForm.get('cantidad_form'); }

  // Submit para Add
  submit() {

    const nombre = ((<HTMLInputElement>document.getElementById("nombre")).value);
    const descri = ((<HTMLInputElement>document.getElementById("descri")).value);
    const costo = ((<HTMLInputElement>document.getElementById("costo")).value);
    const precio = ((<HTMLInputElement>document.getElementById("precio")).value);
    const cantidad = ((<HTMLInputElement>document.getElementById("cantidad")).value);

    let newArticulo = {
      nombre_articulo: nombre,
      descri_articulo: descri,
      costo_articulo: costo,
      precio_articulo: precio,
      cant_disponible_articulo: cantidad,
      id_proveedor: 1,
      id_estado: 1,
    }

    console.log(newArticulo);

    this.api.post('articulo', newArticulo)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Articulo registrado');
          // Llama a la funcion para actualizar la lista
          this.reloadTabla();

          // Funcion para resetear el formulario
          this.articuloForm.reset();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      }, error => {
        console.log('Si hay error en el post: ', error);
      });
  }

  // Submit para Edit
  submitEdit() {
    const nombre = ((<HTMLInputElement>document.getElementById("nombre_edit")).value);
    const descri = ((<HTMLInputElement>document.getElementById("descri_edit")).value);
    const costo = ((<HTMLInputElement>document.getElementById("costo_edit")).value);
    const precio = ((<HTMLInputElement>document.getElementById("precio_edit")).value);
    const cantidad = ((<HTMLInputElement>document.getElementById("cantidad_edit")).value);
    let estadoArticulo = ((<HTMLInputElement>document.getElementById("estado_articulo")));

    let editArticulo = {
      nombre_articulo: nombre,
      descri_articulo: descri,
      costo_articulo: costo,
      precio_articulo: precio,
      cant_disponible_articulo: cantidad,
      id_proveedor: 1,
      id_estado: !estadoArticulo.checked ? 1 : 2
    }

    //console.log(editArticulo);

    this.api.put('articulo/' + this.articuloEditarID, editArticulo)
      .subscribe(result => {
        // Se actualiza la vista html si el result retorna un objeto, significa que inserto en la bd. De lo contrario muestra el mensaje de error que retorna el server
        if (typeof result === 'object') {
          this.toastr.success('Articulo modificado');
          // Llama a la funcion onInit que resetea el formulario
          this.reloadTabla();
        } else {
          console.log('result post: ', result);
          this.toastr.warning(result);
        }
      });
  }

  // Submit para Delete
  delete(value: any) {
    const id = value.id_articulo
    console.log(id);
    this.api.delete('articulo/' + id)
      .subscribe(result => {
        console.log('result delete: ', result);
        for (let u of this.articulos) {
          if (u.id_articulo === id) {
            this.articulos.splice(this.articulos.indexOf(u), 1);
          }
        }
      });
  }

  // Se llama al modal para editar el
  showEditModal(value: any) {
    console.log("El elemento seleccionado", value);
    this.articuloEditarID = value.id_articulo;

    this.articuloEditar = {
      nombre_articulo: value.nombre_articulo,
      descri_articulo: value.descri_articulo,
      costo_articulo: value.costo_articulo,
      precio_articulo: value.precio_articulo,
      cant_disponible_articulo: value.cant_disponible_articulo,
      id_proveedor: 1
    }

    console.log("El elemento a editar en objeto", this.articuloEditar, "Tiene ID: ", this.articuloEditarID);

    // Se crea el objeto formgroup con los datos del elemento seleccionado
    this.articuloEditarForm = new FormGroup({
      nombre_form: new FormControl(this.articuloEditar.nombre_articulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      descri_form: new FormControl(this.articuloEditar.descri_articulo, [
        Validators.required,
        Validators.minLength(4)
      ]),
      costo_form: new FormControl(this.articuloEditar.costo_articulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      precio_form: new FormControl(this.articuloEditar.precio_articulo, [
        Validators.required,
        Validators.minLength(2)
      ]),
      cantidad_form: new FormControl(this.articuloEditar.cant_disponible_articulo, [
        Validators.required,
        Validators.minLength(1)
      ])
    });

  }

  getArticulos() {
    // Trae datos del api
    this.api.get('articulo')
      .pipe(map(data => {
        this.articulos = data;
        console.log(this.articulos);
      }))
      .subscribe()
  }
}
