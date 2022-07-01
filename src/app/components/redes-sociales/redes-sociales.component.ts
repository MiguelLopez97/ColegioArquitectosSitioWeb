import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-redes-sociales',
  templateUrl: './redes-sociales.component.html',
  styleUrls: ['./redes-sociales.component.scss'],
})
export class RedesSocialesComponent implements OnInit {
  currentRoute: string = '/';
  isSmallScreen: boolean;
  protected innerWidth: any;

  constructor(private routeService: RouteService) {
    this.routeService.$currentRoute.subscribe(
      (data) => (this.currentRoute = data)
    );

    this.innerWidth = window.innerWidth;
    this.isSmallScreen = this.innerWidth < 1200 ? true : false;
  }

  ngOnInit(): void {}
}
