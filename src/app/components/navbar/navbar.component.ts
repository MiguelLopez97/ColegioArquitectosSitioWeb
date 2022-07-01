import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { BusquedaInteligente } from '../../models/busquedaInteligente.model';

import { CriptoService } from '../../services/cripto.service';
import { AuthService } from '../../services/auth.service';
import { RouteService } from '../../services/route.service';
import { CambiarContraseniaComponent } from '../../socio/cambiar-contrasenia/cambiar-contrasenia.component';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ConvenioModel } from 'src/app/models/convenio.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  public value: string;
  public fullNameDesencriptado: string;
  private currentRoute: string;
  public resultados: BusquedaInteligente[] = [];
  public patrocinadores: ConvenioModel[] = [];
  // public userTypeId: number = 5;
  public userTypeId: number;

  @ViewChild('header') header: ElementRef;

  @Output() propagarHeight = new EventEmitter<number>();

  constructor(
    private _router: Router,
    private _authService: AuthService,
    public dialog: MatDialog,
    private _routeService: RouteService,
    private _convenioService: ConvenioService,
    private cripto: CriptoService
  ) {
    //Desencriptación del fullName tomado del localStorage
    this.fullNameDesencriptado = this.cripto.decrypt(
      localStorage.getItem('fullName')
    );
    // Descriptación del userTypeId tomado del localStorage
    // this.userTypeId = +this.cripto.decrypt(localStorage.getItem('userTypeId'));

    this._routeService.$currentRoute.subscribe((data) => {
      this.currentRoute = data;
      // console.log('this.currentRoute :>> ', this.currentRoute);
    });
  }

  ngOnInit(): void {
    this.getFullName();
    this.getPatrocinadores();
    this.reloadCaroucel();
  }

  ngAfterViewInit(): void {
    const headerHeight = this.header.nativeElement.offsetHeight;
    this.propagarHeight.emit(headerHeight);
  }

  getPatrocinadores() {
    this._convenioService
      .getPatrocinadores()
      .subscribe(({ data }) => (this.patrocinadores = data));
  }

  reloadCaroucel() {
    this._convenioService.$reloadPatrocinadores.subscribe((data) =>
      this.getPatrocinadores()
    );
  }

  getFullName() {
    this._authService.fullName.subscribe((response) => {
      //Obtiene el valor emitido de 'fullName' del servicio 'authService'
      this.fullNameDesencriptado = response;
      this.userTypeId = +this.cripto.decrypt(
        localStorage.getItem('userTypeId')
      );
      console.log('this.userTypeId :>> ', this.userTypeId);
    });
  }

  //Abre el modal de Angular Material para cambiar contraseña
  openDialogChangePassword() {
    const dialogRef = this.dialog.open(CambiarContraseniaComponent, {
      height: 'auto',
      width: '400px',
    });
  }

  cerrarSesion() {
    this._authService.logout();
    this._router.navigate(['/login']);
    this.fullNameDesencriptado = this.cripto.decrypt(
      localStorage.getItem('fullName')
    );
  }

  searchCategorie(): string {
    const proyectSocio = this.selectProyectoSocio();

    if (this.currentRoute === '/agenda') {
      return 'a';
    }
    if (this.currentRoute === '/noticias') {
      return 'n';
    }
    if (this.currentRoute === '/normateca') {
      return 'nr';
    }
    if (
      this.currentRoute === '/afiliados' ||
      this.currentRoute === '/contratar-arquitecto' ||
      this.currentRoute === '/consejo-directivo' ||
      proyectSocio === 'socio'
    ) {
      return 'ps';
    }
    if (proyectSocio === 'proyecto') {
      return 'p';
    }
    return 't';
  }

  onSearchKey() {
    const categorie = this.searchCategorie();
    this._router.navigate(['/busqueda', categorie, this.value]);
    this.value = '';
  }

  selectProyectoSocio(): string {
    const regexSocio =
      /(^|\W)\/contratar-arquitecto\/arquitecto\/(|\W)(\d+(\d+)*)/g;
    const regexProyecto =
      /(^|\W)\/contratar-arquitecto\/arquitecto\/(|\W)(\d+(\d+)*)(|\W)\/proyecto\/(|\W)(\d+(\d+)*)/g;

    const socio = regexSocio.test(this.currentRoute);
    const proyecto = regexProyecto.test(this.currentRoute);

    if (socio && !proyecto) {
      return 'socio';
    }
    if (socio && proyecto) {
      return 'proyecto';
    }

    return '';
  }
}
