import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AsociacionService } from '../../services/asociacion.service';
import { RouteService } from 'src/app/services/route.service';
import {
  SocioOrganigramaModel,
  NivelesModel,
} from '../../models/socioOrganigrama.model';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-consejo-directivo',
  templateUrl: './consejo-directivo.component.html',
  styleUrls: ['./consejo-directivo.component.scss'],
})
export class ConsejoDirectivoComponent
  extends SeoService
  implements OnInit, AfterViewInit {
  consejo: SocioOrganigramaModel[] = [];
  niveles: NivelesModel[] = [];
  loading: boolean;

  constructor(
    private _asociacionService: AsociacionService,
    private _routeService: RouteService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
    this.loading = true;
    this._routeService.setOriginRoute();
  }

  ngOnInit(): void {
    this.updateTags('Consejo Directivo', 'consejo-directivo');
    this.getOrganigrama();
  }

  ngAfterViewInit(): void {
    const row = document.querySelector('.org-container');
    console.log(row);
  }

  getOrganigrama() {
    this._asociacionService.getOrganigrama().subscribe(
      (response) => {
        this.consejo = response.data;
        this.addNivel();
      },
      (error) => {
        console.log('error :>> ', error);
        this.loading = false;
      }
    );
  }

  addNivel(): void {
    for (let i = 0; i < this.consejo.length; i++) {
      if (this.niveles.length === 0) {
        const nivel = {
          nivel: this.consejo[i].nivel,
          socios: [this.consejo[i]],
        };
        this.niveles.push(nivel);
      } else {
        const yaExiste = this.niveles.findIndex(
          (n) => n.nivel === this.consejo[i].nivel
        );
        if (yaExiste >= 0) {
          // Si ya existe, insertar en la posicion encontrada
          this.niveles[yaExiste].socios.push(this.consejo[i]);
        } else {
          // Si no existe crear un nuevo nivel
          const nivel = {
            nivel: this.consejo[i].nivel,
            socios: [this.consejo[i]],
          };
          this.niveles.push(nivel);
        }
      }
    }

    this.loading = false;
    this.getLowestSize();
  }

  getLowestSize() {
    if (!this.loading) {
      const row = document.querySelector('.org-container');
      console.log(row);
    }
  }
}
