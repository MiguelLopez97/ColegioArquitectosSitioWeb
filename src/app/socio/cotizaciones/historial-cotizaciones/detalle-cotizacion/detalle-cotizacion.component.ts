import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CotizacionModel } from 'src/app/models/cotizacion.model';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-cotizacion',
  templateUrl: './detalle-cotizacion.component.html',
  styleUrls: ['./detalle-cotizacion.component.scss'],
})
export class DetalleCotizacionComponent implements OnInit {
  public cotizacion = new CotizacionModel();
  public loading: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _proyectoService: ProyectoService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getCotizacion();
  }

  getCotizacion() {
    this._route.params.subscribe((params) => {
      const idCotizacion = params.idCotizacion;

      this._proyectoService.getCotizacion(idCotizacion).subscribe(
        (response) => {
          console.log(response);
          this.cotizacion = response.data;
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
          if (error.status === 401) {
            // logout
            this._authService.logout();
            this._router.navigate(['/login']);
          }
        }
      );
    });
  }

  updateEstatus() {
    Swal.fire({
      title: '¿Está seguro que quiere enviar la cotización a autorización?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2054A1',
      cancelButtonColor: '#78797A',
      confirmButtonText: 'Reportar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Espere',
          text: 'Enviando cotización a autorización',
        });

        Swal.showLoading();

        this._proyectoService
          .updateStatusCotizacion(this.cotizacion.idCotizacion, 2)
          .subscribe(
            (response) => {
              console.log(response);
              Swal.close();
              this.getCotizacion();
              Swal.fire({
                icon: 'success',
                title: 'Cotización enviada a autorización correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            },
            (error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error al enviar cotización a autorización',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2054A1',
              });
            }
          );
      }
    });
  }
}
