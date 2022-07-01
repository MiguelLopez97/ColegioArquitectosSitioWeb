import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { CriptoService } from '../../services/cripto.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss']
})
export class CambiarContraseniaComponent implements OnInit {

  public changePassForm: FormGroup;
  public idUsuarioDesencriptado: string;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private cripto: CriptoService,
    public dialogRef: MatDialogRef<CambiarContraseniaComponent>,
    private _usuarioService: UsuarioService
  ) { 
    this.buildFormCambiarContraseña();
    this.idUsuarioDesencriptado = this.cripto.decrypt(localStorage.getItem('idUsuario'));
  }

  ngOnInit(): void {
  }

  //Formulario reactivo para 'Cambiar contraseña'
  buildFormCambiarContraseña()
  {
    this.changePassForm = this._formBuilder.group({
      nuevaPass1: ['', Validators.required],
      nuevaPass2: ['', Validators.required]
    }, 
    {
      validators: [this.passwordIguales('nuevaPass1', 'nuevaPass2')]
    });
  }

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    this.dialogRef.close();
  }

  cambiarPassword()
  {
    if (this.changePassForm.invalid) {
      Object.values(this.changePassForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Actualizando contraseña'
    });
    Swal.showLoading();

    this._usuarioService.updateContrasenia(this.idUsuarioDesencriptado, this.changePassForm.value.nuevaPass1, this.changePassForm.value.nuevaPass2).subscribe(
      response => {
        console.log(response);
        if(response.success == true)
        {
          this._authService.logout();
          this.closeDialog();
          this._router.navigate(['/login']);
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada correctamente',
            text: 'Inicie sesión nuevamente para efectuar los cambios',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la contraseña',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar la contraseña',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }

  //Validaciones para el formulario del modal 'Cambiar Contraseña'
  get pass1NoValido() 
  {
    return this.changePassForm.get('nuevaPass1').invalid && this.changePassForm.get('nuevaPass1').touched;
  }

  get pass2NoValido() 
  {
    return this.changePassForm.get('nuevaPass2').invalid && this.changePassForm.get('nuevaPass2').touched;
  }  

  get pass2NoCoincide() 
  {
    const pass1 = this.changePassForm.get('nuevaPass1').value;
    const pass2 = this.changePassForm.get('nuevaPass2').value;
    return ( pass2 === pass1 ) ? false : true;
  }

  //Valida que la nueva contraseña y la contraseña que se repite son iguales
  passwordIguales(pass1Name, pass2Name)
  {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
      
      if(pass1Control.value == pass2Control.value)
      {
        pass2Control.setErrors(null);
      }
      else
      {
        pass2Control.setErrors({noEsIgual: true});
      }  
    }
  }

}
