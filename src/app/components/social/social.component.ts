import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent
  extends SeoService
  implements OnInit, AfterViewInit {
  constructor(private titleService: Title, private metaService: Meta) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Redes Sociales', 'redes-sociales');
  }

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
    (<any>window).FB.XFBML.parse();
    // * En un futuro si se quiere agregar una de instagram
    // (<any>window).instgrm.Embeds.process();
  }
}
