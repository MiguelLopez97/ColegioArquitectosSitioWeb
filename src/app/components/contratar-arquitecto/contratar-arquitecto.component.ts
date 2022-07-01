import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contratar-arquitecto',
  templateUrl: './contratar-arquitecto.component.html',
  styleUrls: ['./contratar-arquitecto.component.scss'],
})
export class ContratarArquitectoComponent extends SeoService implements OnInit {
  constructor(
    private _routeService: RouteService,
    private titleService: Title,
    private metaService: Meta
  ) {
    super(titleService, metaService);
    this._routeService.setOriginRoute();
  }

  ngOnInit(): void {
    this.updateTags('Contratar un Arquitecto', 'contratar-arquitecto');
  }
}
