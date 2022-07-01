import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioModel } from '../../../models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-curso',
  templateUrl: './registro-curso.component.html',
  styleUrls: ['./registro-curso.component.scss']
})
export class RegistroCursoComponent implements OnInit {

  public registroForm: FormGroup;

  public usuario = new UsuarioModel();

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _usuarioService: UsuarioService
  ) { 
    this.buildFormRegistro();
  }

  ngOnInit(): void {
  }

  buildFormRegistro()
  {
    this.registroForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      genero: ['', Validators.required],
    });
  }

  //Valida que las teclas pulsadas sean únicamente números
  validaNumeros(event)
  {    
    if (event.charCode >= 48 && event.charCode <= 57)
    {
      return true;
    }
    return false; 
  }

  saveRegistro()
  {
    if (this.registroForm.invalid) {
      Object.values(this.registroForm.controls).forEach( control => {
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

    //Datos a enviar a la API
    this.usuario.nombre = this.registroForm.get('nombre').value;
    this.usuario.apellidoPat = this.registroForm.get('apPaterno').value;
    this.usuario.apellidoMat = this.registroForm.get('apMaterno').value;
    this.usuario.correoElectronico = this.registroForm.get('correo').value;
    this.usuario.telefonoFijo = this.registroForm.get('telefono').value;
    this.usuario.genero = this.registroForm.get('genero').value;

    this._usuarioService.createUsuarioExterno(this.usuario).subscribe(
      response => {
        console.log(response);
        if (response.success == true) {
          Swal.fire({
            icon: 'success',
            title: 'Registro realizado correctamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });

          //Redirigimos al login
          this._router.navigate(['/login']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al realizar el registro',
            text: response.firstError,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar el registro',
          text: 'Intente más tarde',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }

  get nombreNoValido() {
    return this.registroForm.get('nombre').invalid && this.registroForm.get('nombre').touched;
  }

  get apPaternoNoValido() {
    return this.registroForm.get('apPaterno').invalid && this.registroForm.get('apPaterno').touched;
  }

  get apMaternoNoValido() {
    return this.registroForm.get('apMaterno').invalid && this.registroForm.get('apMaterno').touched;
  }

  get correoNoValido() {
    return this.registroForm.get('correo').invalid && this.registroForm.get('correo').touched && !this.registroForm.get('correo').hasError('email');
  }

  get formatoCorreoNoValido() {
    return this.registroForm.get('correo').hasError('email') && this.registroForm.get('correo').touched;
  }

  get telefonoNoValido() {
    return this.registroForm.get('telefono').invalid && this.registroForm.get('telefono').touched;
  }

  get generoNoValido() {
    return this.registroForm.get('genero').invalid && this.registroForm.get('genero').touched;
  }

}
