import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagosService } from '../../../services/pagos.service';
import { PagoModel } from '../../../models/pago.model';

@Component({
  selector: 'app-pago-result',
  templateUrl: './pago-result.component.html',
  styleUrls: ['./pago-result.component.scss']
})
export class PagoResultComponent implements OnInit {

  public dataPago = localStorage.getItem('pago');
  public idCargo: string;
  public pago = new PagoModel();

  //Propiedades para validación en la vista
  public existDataPagoLocalStorage: boolean;
  public transactionCompleted: boolean;
  public loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _pagosService: PagosService
  ) { }

  ngOnInit(): void {
    //Obtenemos el parámetro 'idCargo' desde la URL
    this._route.queryParams.subscribe(params => {
      this.idCargo = params['id'];
    });

    //Si existe los datos del Pago en el localStorage
    if (localStorage.getItem('pago') != null)
    {
      //Obtenemos el esatus del pago y determinamos mostrar mensaje 'true/false'
      this.getEstatusPago();
      this.existDataPagoLocalStorage = true;
      this.pago = JSON.parse(this.dataPago);
    }
    else //Si no existe información del Pago
    {
      //Muestra la página de 'Not found'
      this.existDataPagoLocalStorage = false;
    }
  }

  getEstatusPago()
  {
    this._pagosService.getEstatusPago(this.idCargo).subscribe(
      response => {
        console.log(response);
        if (response.data == 'completed')
        {
          this.transactionCompleted = true;
          this.loading = false;
        }
        else
        {
          this.transactionCompleted = false;
          this.loading = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    //Borra el objeto de Pago en el localStorage
    localStorage.removeItem('pago');
  }

}
