import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ProyectoService } from '../../../services/proyecto.service';
import { ProyectoModel } from '../../../models/proyecto.model';
import { FotoProyectoModel } from '../../../models/foto-proyecto.model';

@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.scss'],
})
export class DetalleProyectoComponent implements OnInit {
  public proyecto = new ProyectoModel();
  public fotosProyecto: FotoProyectoModel[] = [];
  public primerasCincoFotos: FotoProyectoModel[] = [];
  public ultimasFotos: FotoProyectoModel[] = [];
  public loading: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _proyectoService: ProyectoService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getProyecto();
    this.getPhotos();
  }

  getProyecto() {
    this._route.params.subscribe((params) => {
      let idProyecto = params['idProyecto'];

      this._proyectoService.getProyecto(idProyecto).subscribe(
        (response) => {
          console.log(response);
          this.proyecto = response.data;
        },
        (error) => {
          console.log(error);
          if (error.status === 401) {
            // logout
            this._authService.logout();
            this._router.navigate(['/login']);
          }
        }
      );
    });
  }

  getPhotos() {
    this._route.params.subscribe((params) => {
      let idProyecto = params['idProyecto'];

      this._proyectoService.getPhotos(idProyecto).subscribe(
        (response) => {
          console.log(response);

          //Array inicial que almacena todos los registros de las fotos que devuelva la API
          this.fotosProyecto = response.data;

          //Separa las 5 fotos que se muestran en la fila debajo de la primer imagen
          this.primerasCincoFotos = this.fotosProyecto.slice(1, 6);

          //Separa las fotos restantes después de las primeras 6 fotos que existan en el array 'fotosProyecto'
          this.ultimasFotos = this.fotosProyecto.slice(6);

          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    });
  }
}
