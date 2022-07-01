import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { SocioModel } from 'src/app/models/socio.model';
import { CertificacionModel } from 'src/app/models/certificacion.model';
import { ProyectoModel } from 'src/app/models/proyecto.model';

import { SocioService } from 'src/app/services/socio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RouteService } from 'src/app/services/route.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { CriptoService } from 'src/app/services/cripto.service';
import { SeoService } from 'src/app/services/seo.service';

import {
  faTwitter,
  faFacebookF,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { SharedResource } from 'src/app/models/share-resource.model';
import { AsociacionService } from 'src/app/services/asociacion.service';

@Component({
  selector: 'app-view-arquitecto',
  templateUrl: './view-arquitecto.component.html',
  styleUrls: ['./view-arquitecto.component.scss'],
})
export class ViewArquitectoComponent extends SeoService implements OnInit {
  idSocio: number;
  socio: SocioModel = new SocioModel();
  certificados: CertificacionModel[] = [];
  proyectos: ProyectoModel[] = [];
  loading: boolean = false;
  loadingImg: boolean = false;
  originRoute: any;
  public imgUri: string;
  metaTags: { name?: string; property?: string; content: string }[];

  icons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    whatsapp: faWhatsapp,
  };

  public idSocioDesencriptado: number;

  constructor(
    private _route: ActivatedRoute,
    private _proyectoService: ProyectoService,
    private _socioService: SocioService,
    private _usuarioService: UsuarioService,
    private _routeService: RouteService,
    private _googleAnalytics: GoogleAnalyticsService,
    private _asociacionService: AsociacionService,
    private _seo: SeoService,
    private cripto: CriptoService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);

    this.originRoute = this._routeService.getOriginRoute();
    this.idSocioDesencriptado = this.cripto.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.idSocio = +params['idSocio'];
    });

    this.loading = true;
    this.loadingImg = true;
    this.getInformacion();
    this.getCertificaciones();
    this.getProyectos();

    if (this.socio || this.certificados.length > 0 || this.proyectos.length > 0)
      this.loading = false;
  }

  getInformacion() {
    this._socioService.getSocio(this.idSocio).subscribe(
      (response) => {
        this.socio = response.data;
        this.updateTags(
          `${this.socio.nombreCompleto} ${this.socio.apellidoPat} ${this.socio.apellidoMat}`,
          `contratar-arquitecto/arquitecto/${this.idSocio}`
        );
        this.getAvatar(this.socio.idSocio);
        console.log('this.arquitecto :>> ', this.socio);
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  getCertificaciones() {
    this._socioService.getCertificaciones(this.idSocio).subscribe(
      (response) => {
        this.certificados = response.data;
        console.log('this.certificados :>> ', this.certificados);
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  getProyectos() {
    this._proyectoService.getProyectosBySocio(this.idSocio).subscribe(
      (response) => {
        this.proyectos = response.data;
        this.getFotosProyecto(this.proyectos);
        console.log('this.proyectos :>> ', this.proyectos);
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  getAvatar(idSocio: number) {
    this._usuarioService.getAvatarUri(idSocio).subscribe(
      (res) => {},
      (error) => {
        if (
          error.error.text ==
          'gcaseqa-001-site39.atempurl.com/Content/img/profile/'
        ) {
          this.imgUri = '../../../../../assets/img/noFoto.jpg';
          this.loadingImg = false;
        } else {
          this.imgUri = 'http://' + error.error.text;
          this.loadingImg = false;
        }
      }
    );
  }

  getFotosProyecto(proyectos: ProyectoModel[]): void {
    for (let i = 0; i < proyectos.length; i++) {
      this._proyectoService.getProyectoFotos(proyectos[i].idProyecto).subscribe(
        (response) => {
          this.proyectos[i].fotos = response.data;
        },
        (error) => {
          console.log('error :>> ', error);
        }
      );
    }
  }

  shareArquitecto(proyecto: ProyectoModel): void {
    const nombreArquitecto = `${this.socio.nombreCompleto} ${this.socio.apellidoPat} ${this.socio.apellidoMat}`;
    this._proyectoService.setArquitecto(nombreArquitecto);
  }

  shareResource(platform: string) {
    // Envía registro del evento del click de compartir una proyecto a Google Analytics
    setTimeout(() => {
      this._googleAnalytics.eventEmitter(
        `share_socio/${this.socio.nombreCompleto} ${this.socio.apellidoPat} ${this.socio.apellidoMat}`,
        'socio',
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
      idResource: this.socio.idSocio,
      title: `${this.socio.nombreCompleto} ${this.socio.apellidoPat} ${this.socio.apellidoMat}`,
      url: `/contratar-arquitecto/arquitecto/${this.socio.idSocio}`,
      description: this.socio.curriculumVitae,
      imgUri: this.socio?.avatarUri
        ? this.socio?.avatarUri
        : 'https://api.arquitab.org.mx/Content/img/profile/SinPerfil.jpg',
    };

    this._asociacionService.shared(parameters).subscribe(({ data }: any) => {
      // console.log('res :>> ', data);
      const urlEncoded = encodeURIComponent(data);
      // console.log(urlShared.concat(urlEncoded));

      if (platform === 't') {
        window.location.href = urlToShared
          .concat(urlEncoded)
          .concat(
            `&text=${this.socio.nombreCompleto} ${this.socio.apellidoPat} ${this.socio.apellidoMat}`
          );
      } else if (platform === 'w') {
        window.location.href = urlToShared.concat(urlEncoded);
      } else {
        window.location.href = urlToShared.concat(urlEncoded);
      }
    });
  }
}
