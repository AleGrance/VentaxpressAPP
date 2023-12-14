import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  public cuentasMadre: any;
  public cuentasHijo: any;
  public cuentasContable: any;

  public cuentaMadreNueva = {
    nombre_cuenta_madre: 'Nombre',
  };
  public cuentaHijoNueva = {
    nombre_cuenta_hijo: 'Nombre',
  };

  public cuentaContableNueva = {
    nombre_cuenta_contable: 'Nombre',
  };

  public cuentaMadreForm: any;
  public cuentaHijoForm: any;
  public cuentaContableForm: any;

  constructor(public api: ApiService) { }

  ngOnInit(): void {

    this.cuentaMadreForm = new FormGroup({
      nombreCuentaMadre: new FormControl(this.cuentaMadreNueva.nombre_cuenta_madre, [
        Validators.required,
        Validators.minLength(4)
      ]),
    });

    this.cuentaHijoForm = new FormGroup({
      nombreCuentaHijo: new FormControl(this.cuentaHijoNueva.nombre_cuenta_hijo, [
        Validators.required,
        Validators.minLength(4)
      ]),
    });

    this.cuentaContableForm = new FormGroup({
      nombreCuentaContable: new FormControl(this.cuentaContableNueva.nombre_cuenta_contable, [
        Validators.required,
        Validators.minLength(4)
      ]),
    });

    // Trae datos del api
    // Cuentas Madres
    this.api.get('cuenta_madre')
      .pipe(map(data => {
        this.cuentasMadre = data;
        console.log(this.cuentasMadre);
      }))
      .subscribe()

    // Cuentas Hijos
    this.api.get('cuenta_hijo')
      .pipe(map(data => {
        this.cuentasHijo = data;
        console.log(this.cuentasHijo);
      }))
      .subscribe()

    // Cuentas Contables
    this.api.get('cuenta_contable')
      .pipe(map(data => {
        this.cuentasContable = data;
        console.log(this.cuentasContable);
      }))
      .subscribe()

  }

  get nombreCuentaMadre() { return this.cuentaMadreForm.get('nombreCuentaMadre'); }
  get nombreCuentaHijo() { return this.cuentaHijoForm.get('nombreCuentaHijo'); }
  get nombreCuentaContable() { return this.cuentaContableForm.get('nombreCuentaContable'); }

  submitMadre() {

    const nombre = ((<HTMLInputElement>document.getElementById("nombreCuentaMadre")).value);

    let newCuenta = {
      nombre_cuenta_madre: nombre
    }

    this.api.post('cuenta_madre', newCuenta)
      .subscribe(result => {
        this.cuentasMadre.push(result);
        console.log('result post: ', result);
      });
  }

  submitHijo() {

    const nombre = ((<HTMLInputElement>document.getElementById("nombreCuentaHijo")).value);

    let newCuenta = {
      nombre_cuenta_hijo: nombre
    }

    this.api.post('cuenta_hijo', newCuenta)
      .subscribe(result => {
        this.cuentasHijo.push(result);
        console.log('result post: ', result);
      });
  }

  submitContable() {

    const nombre = ((<HTMLInputElement>document.getElementById("nombreCuentaContable")).value);

    let newCuenta = {
      nombre_cuenta_contable: nombre
    }

    this.api.post('cuenta_contable', newCuenta)
      .subscribe(result => {
        this.cuentasContable.push(result);
        console.log('result post: ', result);
      });
  }

}
