import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import {
  ProyectoModel,
  FotoProyectoModel,
} from '../../../models/proyecto.model';
import { SharedResource } from 'src/app/models/share-resource.model';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { SeoService } from 'src/app/services/seo.service';
import { AsociacionService } from 'src/app/services/asociacion.service';

import {
  faTwitter,
  faFacebookF,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-view-proyecto',
  templateUrl: './view-proyecto.component.html',
  styleUrls: ['./view-proyecto.component.scss'],
})
export class ViewProyectoComponent extends SeoService implements OnInit {
  idProyecto: number;
  proyecto: ProyectoModel = new ProyectoModel();
  loading: boolean = false;
  loadingImg: boolean = false;
  nombreArquitecto: string;
  currentRoute: any;
  fbLink: string;

  icons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    whatsapp: faWhatsapp,
  };

  public idSocioDesencriptado: number;

  public primerasCincoFotos: FotoProyectoModel[] = [];
  public ultimasFotos: FotoProyectoModel[] = [];
  public fotosRestantesParaMostrarMovil: FotoProyectoModel[] = [];
  public rutaParaCompartirFb: string;
  public rutaParaCompartirTw: string;
  public rutaActual: string;
  metaTags: { name?: string; property?: string; content: string }[];

  constructor(
    private _route: ActivatedRoute,
    private _proyectoService: ProyectoService,
    private _asociacionService: AsociacionService,
    private _googleAnalytics: GoogleAnalyticsService,
    private cripto: CriptoService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.currentRoute = this._route.snapshot;
    this._route.params.subscribe((params) => {
      this.idProyecto = +params['idProyecto'];

      this.buildMetaTags();
    });

    this.idSocioDesencriptado = this.cripto.decrypt(
      localStorage.getItem('idSocio')
    );

    this._proyectoService.$arquitecto.subscribe((data) => {
      this.nombreArquitecto = data;
    });

    this.loading = true;
    this.loadingImg = true;
    this.getInformacion();
    this.rutaActual = `http://arquitab.org.mx/contratar-arquitecto/arquitecto/${this.currentRoute.params.idSocio}/proyecto/${this.idProyecto}`;
  }

  getInformacion(): void {
    this._proyectoService.getProyecto(this.idProyecto).subscribe(
      (response) => {
        this.proyecto = response.data;

        this.updateTags(
          this.proyecto.titulo,
          'contratar-arquitecto/arquitecto/:idSocio/proyecto/',
          `Arquitecto(a): ${this.proyecto.arquitectos}`
        );

        this.getFotos();
        this.loading = false;
        this.buildMetaTags();
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  getFotos(): void {
    this._proyectoService.getProyectoFotos(this.idProyecto).subscribe(
      (response) => {
        this.proyecto.fotos = response.data;
        console.log('this.proyecto :>> ', this.proyecto);

        this.updateTags(
          this.proyecto.titulo,
          `contratar-arquitecto/arquitecto/${this.currentRoute.params.idSocio}/proyecto/${this.idProyecto}`,
          `Arquitecto(a): ${this.proyecto.arquitectos}`,
          this.proyecto?.fotos[0]?.foto
        );

        //Separa las 5 fotos que se muestran en la fila debajo de la primer imagen
        this.primerasCincoFotos = this.proyecto.fotos.slice(1, 6);

        //Separa las fotos restantes después de las primeras 6 fotos que existan en 'proyecto.fotos'
        this.ultimasFotos = this.proyecto.fotos.slice(6);

        //Separa las demás fotos de la primera foto (para versión móvil)
        this.fotosRestantesParaMostrarMovil = this.proyecto.fotos.slice(1);

        this.loadingImg = false;
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  buildMetaTags() {
    const pURL = `http://arquitab.org.mx/contratar-arquitecto/arquitecto/${this.currentRoute.params.idSocio}/proyecto/${this.idProyecto}`;
  }

  shareResource(platform: string) {
    // Envía registro del evento del click de compartir una proyecto a Google Analytics
    setTimeout(() => {
      this._googleAnalytics.eventEmitter(
        `share_proyecto/${this.proyecto.titulo}`,
        'proyecto',
        'share',
        platform == 'f' ? 'Facebook' : platform == 't' ? 'Twitter' : 'Whatsapp'
      );
    }, 50);

    // Establecer el url base dependiendo de la plataforma a la que se quiera compartir
    let urlToShared;
    if (platform === 'f') {
      urlToShared = 'https://www.facebook.com/sharer.php?s=100&p%5Burl%5D=';
    } else if (platform === 't') {
      urlToShared = 'https://twitter.com/intent/tweet?url=';
    } else if (platform === 'w') {
      urlToShared = 'https://wa.me//?phone&text=';
    }

    // Formar objecto request para el api
    const parameters: SharedResource = {
      resource: 'proyecto',
      idResource: this.idProyecto,
      title: this.proyecto.titulo,
      url: `/contratar-arquitecto/arquitecto/${this.currentRoute.params.idSocio}/proyecto/${this.idProyecto}`,
      description: `Arquitecto(a): ${this.proyecto.arquitectos}`,
      imgUri: this.proyecto?.fotos[0]?.foto
        ? this.proyecto?.fotos[0]?.foto
        : 'http://api.arquitab.org.mx//Content/img/slides//6.jpeg?t=44297.7724422068',
    };

    this._asociacionService.shared(parameters).subscribe(({ data }: any) => {
      // console.log('res :>> ', data);
      const urlEncoded = encodeURIComponent(data);
      // console.log(urlShared.concat(urlEncoded));

      if (platform === 't') {
        window.location.href = urlToShared
          .concat(urlEncoded)
          .concat(`&text=${this.proyecto.titulo}`);
      } else if (platform === 'w') {
        window.location.href = urlToShared.concat(urlEncoded);
      } else {
        window.location.href = urlToShared.concat(urlEncoded);
      }
    });
  }
}
