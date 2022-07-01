import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { CriptoService } from '../../../services/cripto.service';
import { SocioService } from '../../../services/socio.service';
import { SocioModel } from '../../../models/socio.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-otros-datos',
  templateUrl: './form-otros-datos.component.html',
  styleUrls: ['./form-otros-datos.component.scss'],
})
export class FormOtrosDatosComponent implements OnInit {
  public socio: SocioModel = new SocioModel();
  public idSocioDesencriptado: string;
  public loading: boolean = false;
  public loadingColonias: boolean = false;

  public allColonias: any[] = [];

  constructor(
    private _socioService: SocioService,
    private _criptoService: CriptoService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.idSocioDesencriptado = this._criptoService.decrypt(
      localStorage.getItem('idSocio')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.getSocio();
  }

  getSocio() {
    this._socioService.getSocioEdicion(this.idSocioDesencriptado).subscribe(
      (response) => {
        //console.log(response);
        this.socio = response.data;
        console.log(this.socio);
       
        //Obtiene las colonias
        this.getColonias()
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
        if (error.status === 401) {
          // logout
          this._authService.logout();
          this._router.navigate(['/login']);
        }
      }
    );
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  getColonias()
  {
    this.loadingColonias = true;
    this._socioService.getAllColonias(this.socio.codigoPostal).subscribe(
      response => {
        console.log(response);
        this.allColonias = response.data;
        this.loadingColonias = false;
      },
      error => {
        console.log(error);
        this.loadingColonias = false;
      }
    );
  }

  saveSocio() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información',
    });
    Swal.showLoading();

    //Actualiza los datos del socio
    this._socioService.updateSocio(this.socio).subscribe(
      (response) => {
        console.log(response);
        if (response.success == true) {
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar los datos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }
}
