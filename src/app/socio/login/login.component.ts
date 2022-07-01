import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Propiedad para almacenar la ruta anterior
  public previousUrl: string = '';

  //Formulario reactivo para iniciar sesión
  public loginForm: FormGroup;

  //Propiedad para almacenar el año
  public currentDate: Date = new Date();

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _formBuilder: FormBuilder
  ) { 
    this.buildFormLogin();

    this._router.events
    .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
    .subscribe(
      (events: RoutesRecognized[]) => {
        //Almacenamos el valor de la ruta anterior en el método 'setRutaAnterior' de AuthService
        this._authService.setRutaAnterior(events[0].urlAfterRedirects);
      }
    );
  }

  ngOnInit(): void {
    //Asignamos el valor de la url anterior almacenada en 'authService'
    this.previousUrl = this._authService.getRutaAnterior();
  }

  get correoNoValido() {
    return this.loginForm.get('correoElectronico').hasError('required');
  }

  get contraseniaNoValida() {
    return this.loginForm.get('contrasenia').hasError('required');
  }

  buildFormLogin()
  {
    this.loginForm = this._formBuilder.group({
      correoElectronico: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  iniciarSesion() 
  {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Iniciando sesión',
      text: 'Un momento por favor'
    });
    Swal.showLoading();

    this._authService.login(this.loginForm.value.correoElectronico, this.loginForm.value.contrasenia).subscribe(
      response => {
        console.log(response);           
        Swal.close();
        
        //Si la ruta anterior proviene de un curso y no es 'undefined'
        if (this.previousUrl != undefined && this.previousUrl.startsWith('/cursos/'))
        {
          //Redirigir a la ruta anterior para registrar al curso al colegiado con el parámetro en URL 'registrar'
          this._router.navigate([this.previousUrl], {queryParams: {registrar: 'true'}});
        }
        else
        {
          //Redirigir al inicio
          this._router.navigate(['/inicio']);
        }
      },
      error => {
        console.log(error);
        if (error.status == 500 || error.status == 400)
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: 'Correo electrónico y/o contraseña no válidos',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error.statusText,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }        
      }
    );
  }

}
