import { Component, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouteService } from './services/route.service';

// 1. Dar permiso de accesso a Angular App al declarar gtag como una función
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'sitioWebColegioArquitectos';
  clientHeight: number;
  headerHeight: number;
  footerHeight: number;
  contentHeight: number;
  isHome: boolean = false;

  constructor(private _router: Router, private _routeService: RouteService) {
    this.clientHeight = window.innerHeight;

    // Obtener el URL para Google Analytics
    // 2. Subscripción al evento "navigationEnd"
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log(event.urlAfterRedirects);
        // 3. Ejecuta la función por cada cambio en la ruta
        gtag('config', 'G-BPY5XR1J71', { page_path: event.urlAfterRedirects });
      }
    });
  }

  ngAfterViewInit(): void {}

  changeOfRoutes() {
    const currentPath = this._router.url;
    if (currentPath === '/inicio') {
      this.isHome = true;
    }
    // console.log('currentPath :>> ', currentPath);
    this._routeService.shareRoute(currentPath);
  }

  getFooterHeight(height) {
    // console.log('appComponent height :>> ', height);
    this.footerHeight = height;
  }

  getHeaderHeight(height) {
    this.headerHeight = height;
  }

  getHeights(height: number, from: number) {
    if (from === 1) {
      this.headerHeight = height;
    }
    if (from === 2) {
      this.footerHeight = height;
    }

    // Si las dos variables ya tienen valores
    if (this.headerHeight && this.footerHeight) {
      // Restar el valor total de la altura de la pantalla del usuario
      const sumaComponentes = this.headerHeight + this.footerHeight;
      const alturaRestante = this.clientHeight - sumaComponentes;

      // Compartir resultado con el componente de home
      this._routeService.changeRemainingHeight(alturaRestante);
    }
  }
}
