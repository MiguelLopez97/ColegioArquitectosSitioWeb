import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { SocioService } from '../../../services/socio.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CriptoService } from '../../../services/cripto.service';
import { SocioModel } from '../../../models/socio.model';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-datos-generales',
  templateUrl: './form-datos-generales.component.html',
  styleUrls: ['./form-datos-generales.component.scss'],
})
export class FormDatosGeneralesComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; //Propiedad para cargar la foto de perfil del Socio

  public socio: SocioModel = new SocioModel();
  public idSocioDesencriptado: string;
  public idUsuarioDesencriptado: number;
  public loading: boolean = false;
  public loadingImg: boolean = false;
  public imgUri: string;

  constructor(
    private _socioService: SocioService,
    private _usuarioService: UsuarioService,
    private _criptoService: CriptoService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.idSocioDesencriptado = this._criptoService.decrypt(
      localStorage.getItem('idSocio')
    );
    this.idUsuarioDesencriptado = this._criptoService.decrypt(
      localStorage.getItem('idUsuario')
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadingImg = true;
    this.getSocio();
    this.getAvatar();
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    }
    return false;
  }

  //Muestra una previsualizacion de la imagen seleccionada localmente del input file
  onFileInput(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUri = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getAvatar() {
    this._usuarioService.getAvatarUri(this.idUsuarioDesencriptado).subscribe(
      (response) => {},
      (error) => {
        if (
          error.error.text ==
          'gcaseqa-001-site39.atempurl.com/Content/img/profile/'
        ) {
          this.imgUri = '../../../../../assets/img/noFoto.jpg';
          this.loadingImg = false;
        } else {
          this.imgUri = 'http://' + error.error.text;
          this.loadingImg = false;
        }
      }
    );
  }

  uploadAvatar() {
    const imageBlob = this.fileInput.nativeElement.files[0];
    const imagen = new FormData();

    imagen.set('imagen', imageBlob);

    this._usuarioService.saveAvatar(imagen).subscribe(
      (response) => {
        console.log('Imagen cargada: ' + response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSocio() {
    this._socioService.getSocioEdicion(this.idSocioDesencriptado).subscribe(
      (response) => {
        console.log(response);
        this.socio = response.data;
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

  saveSocio(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información',
    });
    Swal.showLoading();

    //Carga la foto de perfil
    this.uploadAvatar();

    //Si el idSocio existe
    if (this.socio.idSocio) {
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
    } //Si no existe el idSocio
    else {
      //Crea un nuevo registro de Socio
      this._socioService.createSocio(this.socio).subscribe(
        (response) => {
          console.log(response);

          if (response.success == true) {
            Swal.fire({
              icon: 'success',
              title: 'Datos guardados correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar los datos',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar los datos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      );
    }
  }
}
