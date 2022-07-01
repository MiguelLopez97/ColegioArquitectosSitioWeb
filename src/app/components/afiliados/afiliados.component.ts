import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.scss'],
})
export class AfiliadosComponent extends SeoService implements OnInit {
  constructor(
    private _routeService: RouteService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
    this._routeService.setOriginRoute();
  }

  ngOnInit(): void {
    this.updateTags('Colegiados', 'afiliados');
  }
}
