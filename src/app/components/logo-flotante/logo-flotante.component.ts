import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-logo-flotante',
  templateUrl: './logo-flotante.component.html',
  styleUrls: ['./logo-flotante.component.scss'],
})
export class LogoFlotanteComponent implements OnInit {
  currentRoute: string = '/';

  constructor(private routeService: RouteService) {
    this.routeService.$currentRoute.subscribe(
      (data) => (this.currentRoute = data)
    );
  }

  ngOnInit(): void {}
}
