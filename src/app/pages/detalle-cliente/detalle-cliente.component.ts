import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {
  public clienteEncontrado: any;

  constructor(public api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {  
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const clienteIdFromRoute = Number(routeParams.get('id_contribuyente'));

    console.log(clienteIdFromRoute);

    // Find the product that correspond with the id provided in route.
    this.api.get('cliente/' + clienteIdFromRoute)
    .pipe(map(data => {
      this.clienteEncontrado = data;
      console.log(this.clienteEncontrado);
    }))
    .subscribe()
  }

}
