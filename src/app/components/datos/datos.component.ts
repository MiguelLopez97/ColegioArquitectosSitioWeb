import { Component, OnInit } from '@angular/core';
import {
  faYoutube,
  faTumblr,
  faPinterest,
  faLinkedin,
  faInstagram,
  faTwitter,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent extends SeoService implements OnInit {
  icons = {
    youtube: faYoutube,
    tumblr: faTumblr,
    pinterest: faPinterest,
    linkedin: faLinkedin,
    instagram: faInstagram,
    twitter: faTwitter,
    facebook: faFacebook,
  };

  constructor(private titleService: Title, private metaService: Meta) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Contacto', 'contacto');
  }
}
