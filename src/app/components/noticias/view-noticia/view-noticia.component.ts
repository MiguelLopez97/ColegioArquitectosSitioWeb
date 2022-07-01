import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AsociacionService } from '../../../services/asociacion.service';
import { NoticiaModel } from '../../../models/noticia.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';
import { SharedResource } from 'src/app/models/share-resource.model';

import {
  faTwitter,
  faFacebookF,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-view-noticia',
  templateUrl: './view-noticia.component.html',
  styleUrls: ['./view-noticia.component.scss'],
})
export class ViewNoticiaComponent extends SeoService implements OnInit {
  public noticia = new NoticiaModel();
  public idNoticia: string;
  public loading: boolean = false;
  public text: string;

  public rutaActual: string;
  public rutaParaCompartirFb: string;

  icons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    whatsapp: faWhatsapp,
  };

  constructor(
    private _route: ActivatedRoute,
    private _asociacionService: AsociacionService,
    private _googleAnalytics: GoogleAnalyticsService,
    private _sanitizer: DomSanitizer,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit() {
    this.loading = true;
    this.getNoticia();
  }

  async getNoticia() {
    this._route.params.subscribe(async (params) => {
      this.idNoticia = params['idNoticia'];

      //Invoca al API de getNoticia para recuperar los datos básicos de la Noticia
      await this._asociacionService
        .getNoticia(this.idNoticia)
        .toPromise()
        .then(
          (response) => {
            console.log(response);
            this.noticia = response.data;
            this.updateTags(
              this.noticia.titulo,
              `noticias/noticia/${this.idNoticia}`,
              this.noticia.resumen
            );
          },
          (error) => {
            console.log(error);
          }
        );

      //Invoca al API de getCuerpoNoticia para recuperar el cuerpo de la noticia
      await this._asociacionService
        .getCuerpoNoticia(this.idNoticia)
        .toPromise()
        .then(
          (response) => {
            console.log(response);
            this.noticia.cuerpo = response.data;
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.loading = false;
          }
        );
    });
  }

  shareResource(platform: string) {
    // Envía registro del evento del click de compartir una noticia a Google Analytics
    setTimeout(() => {
      this._googleAnalytics.eventEmitter(
        `share_noticia/${this.noticia.titulo}`,
        'noticia',
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
      resource: 'noticia',
      idResource: +this.idNoticia,
      title: this.noticia.titulo,
      url: `/noticias/noticia/${this.idNoticia}`,
      description: this.noticia.resumen,
      imgUri: this.noticia.imagen
        ? this.noticia.imagen
        : 'http://api.arquitab.org.mx//Content/img/slides//6.jpeg?t=44297.7724422068',
    };

    this._asociacionService.shared(parameters).subscribe(({ data }: any) => {
      // console.log('res :>> ', data);
      const urlEncoded = encodeURIComponent(data);
      console.log(urlToShared.concat(urlEncoded));

      if (platform === 't') {
        window.location.href = urlToShared
          .concat(urlEncoded)
          .concat(`&text=${this.noticia.titulo}`);
      } else if (platform === 'w') {
        window.location.href = urlToShared.concat(urlEncoded);
      } else {
        window.location.href = urlToShared.concat(urlEncoded);
      }
    });
  }
}
