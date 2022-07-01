import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent extends SeoService implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Afiliate en Línea', 'afiliar');
  }
}
