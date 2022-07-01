import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss'],
})
export class CotizacionesComponent implements OnInit {
  reloadChild: number = 0;
  public rutaAnterior: string;
  public indexTab: number;

  constructor(
    private router: Router,
    private _authService: AuthService
  ) {
    this.router.events
    .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
    .subscribe(
      (events: RoutesRecognized[]) => {
        //Almacenamos el valor de la ruta anterior en el método 'setRutaAnterior' de AuthService
        this._authService.setRutaAnterior(events[0].urlAfterRedirects);
      }
    );
  }

  ngOnInit(): void {
    //Asignamos el valor de la url anterior almacenada en 'authService'
    //Para que por defecto se posicione en la pestaña 'Historial' cuando las rutas anteriores sean 'Detalle' o 'Editar' Cotización
    this.rutaAnterior = this._authService.getRutaAnterior();

    if (this.rutaAnterior != undefined)
    {
      if (this.rutaAnterior.startsWith('/cotizaciones/detalle-cotizacion/') || this.rutaAnterior.startsWith('/cotizaciones/editar/'))
      {
        //Seleccionará la pestaña 'Historial' siempre y cuando las rutas coincidan con las de la condición
        this.indexTab = 1;
      }
    }
    
  }

  onChange(e) {
    const tab = e.index;
    if (tab === 1) {
      /**
       * Cambiar el estado de la variable 'reloadChild' que se comparte con el ChildComponent 'HistorialCotizacionesComponent'
       * para que cuando cambia el valor de la misma se detecte el cambio en el ChildComponent y se recargue actomáticamente
       */
      this.reloadChild += 1;
    }
  }

  setTab(event: number)
  {
    console.log(event);
    this.indexTab = event;
  }
}
