import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { MatIconModule } from '@angular/material/icon';
import { EventoModel } from '../../../models/agenda.model';
import { SharedResource } from 'src/app/models/share-resource.model';
import { AsociacionService } from '../../../services/asociacion.service';
import { SeoService } from 'src/app/services/seo.service';

import {
  faTwitter,
  faFacebookF,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-view-evento',
  templateUrl: './view-evento.component.html',
  styleUrls: ['./view-evento.component.scss'],
})
export class ViewEventoComponent extends SeoService implements OnInit {
  public evento: EventoModel = new EventoModel();
  public idEvento: number;
  public loading: boolean = false;

  icons = {
    twitter: faTwitter,
    facebook: faFacebookF,
    whatsapp: faWhatsapp,
  };

  constructor(
    private _route: ActivatedRoute,
    private _asociacionService: AsociacionService,
    private _googleAnalytics: GoogleAnalyticsService,
    private _datePipe: DatePipe,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.loading = true;
    this.getEvento();
  }

  getEvento() {
    this._route.params.subscribe((params) => {
      this.idEvento = +params['idEvento'];

      this._asociacionService.getEvento(this.idEvento).subscribe(
        (response) => {
          console.log('response :>> ', response);
          this.evento = response.data;
          this.updateTags(
            this.evento.descripcion,
            `agenda/evento/${this.idEvento}`
          );
          this.loading = false;
        },
        (error) => {
          console.log('error :>> ', error);
          this.loading = false;
        }
      );
    });
  }

  shareResource(platform: string) {
    // Envía registro del evento del click de compartir una evento a Google Analytics
    setTimeout(() => {
      this._googleAnalytics.eventEmitter(
        `share_evento/${this.evento.descripcion}`,
        'evento',
        'share',
        platform == 'f' ? 'Facebook' : platform == 't' ? 'Twitter' : 'Whatsapp'
      );
    }, 50);

    // Establecer url base dependiendo de la plataforma a la que se quiera compartir
    let urlToShared;
    if (platform === 'f') {
      urlToShared = 'https://www.facebook.com/sharer.php?s=100&p%5Burl%5D=';
    } else if (platform === 't') {
      urlToShared = 'https://twitter.com/intent/tweet?url=';
    } else if (platform === 'w') {
      urlToShared = 'https://wa.me//?phone&text=';
    }

    // Dar formate a las fechas
    const fInicio = this._datePipe.transform(
      this.evento.fechaInicio,
      'longDate'
    );
    const fFin = this._datePipe.transform(this.evento.fechaFin, 'longDate');

    // Formar objeto request para el api
    const parameters: SharedResource = {
      resource: 'agenda',
      idResource: this.idEvento,
      title: this.evento.descripcion,
      url: `/agenda/evento/${this.idEvento}`,
      description: `Fecha de Inicio: ${fInicio} - Fecha de Fin: ${fFin}`,
      imgUri: this.evento.flyer
        ? this.evento.flyer
        : 'http://api.arquitab.org.mx//Content/img/slides//6.jpeg?t=44297.7724422068',
    };

    this._asociacionService.shared(parameters).subscribe(({ data }: any) => {
      const urlEncoded = encodeURIComponent(data);

      if (platform === 't') {
        window.location.href = urlToShared
          .concat(urlEncoded)
          .concat(`&text=${this.evento.descripcion}`);
      } else if (platform === 'w') {
        window.location.href = urlToShared.concat(urlEncoded);
      } else {
        window.location.href = urlToShared.concat(urlEncoded);
      }
    });
  }
}
