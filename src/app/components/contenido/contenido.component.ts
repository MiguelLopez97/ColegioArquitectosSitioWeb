import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss'],
})
export class ContenidoComponent extends SeoService implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('¿Quiénes somos?', 'contenido');
  }
}
