import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; //Importacion para recibir el valor que viene del modal de Angular Material
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { ProyectoService } from '../../../services/proyecto.service';
import { CriptoService } from '../../../services/cripto.service';
import { ProyectoModel } from '../../../models/proyecto.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-proyecto-one',
  templateUrl: './form-proyecto-one.component.html',
  styleUrls: ['./form-proyecto-one.component.scss']
})
export class FormProyectoOneComponent implements OnInit {

  public idSocioDesencriptado: number;
  public categorias:[] = [];
  public proyecto: ProyectoModel = new ProyectoModel();
  public isCheckedTerminosCondiciones: boolean = false;
  public loading: boolean = false;

  //Propiedad para Quill Editor
  public editorStyle = { height: '250px', display: 'inline-block', width: 'inherit' };
  
  //Propiedades para los Tags (Angular Material Chips)
  public visible = true;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public tagsArray: any[] = []; //Almacena los tags que vengan del 'response' de la API

  public anios = [
    {anio: 2021}, {anio: 2020}, {anio: 2019}, {anio: 2018}, {anio: 2017}, {anio: 2016}, {anio: 2015}, {anio: 2014}, {anio: 2013}, {anio: 2012}, {anio: 2011}, {anio: 2010},
    {anio: 2009}, {anio: 2008}, {anio: 2007}, {anio: 2006}, {anio: 2005}, {anio: 2004}, {anio: 2003}, {anio: 2002}, {anio: 2001}, {anio: 2000},
    {anio: 1999}, {anio: 1998}, {anio: 1997}, {anio: 1996}, {anio: 1995}, {anio: 1994}, {anio: 1993}, {anio: 1992}, {anio: 1991}, {anio: 1990},
    {anio: 1989}, {anio: 1988}, {anio: 1987}, {anio: 1986}, {anio: 1985}, {anio: 1984}, {anio: 1983}, {anio: 1982}, {anio: 1981}, {anio: 1980},
    {anio: 1979}, {anio: 1978}, {anio: 1977}, {anio: 1976}, {anio: 1975}, {anio: 1974}, {anio: 1973}, {anio: 1972}, {anio: 1971}, {anio: 1970},
    {anio: 1969}, {anio: 1968}, {anio: 1967}, {anio: 1966}, {anio: 1965}, {anio: 1964}, {anio: 1963}, {anio: 1962}, {anio: 1961}, {anio: 1960},
  ]; 

  constructor(
    private _criptoService: CriptoService,
    private _proyectoService: ProyectoService,
    public dialogRef: MatDialogRef<FormProyectoOneComponent>,
    @Inject(MAT_DIALOG_DATA) public data //Recibe el dato del componente donde se abre el modal de Angular Material
  ) { 
    this.idSocioDesencriptado = this._criptoService.decrypt(localStorage.getItem('idSocio'));
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCategoriaProyecto();

    if(this.data.idProyecto == null)
    {
      this.loading = false;
    }
    else
    {
      this.getProyecto();
    }
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

  //Cierra el modal de Angular Material al dar click en el botón Cancelar
  closeDialog(): void
  {
    //Se agrega el parámetro 'statusResponse' para que no marque error al dar click en el botón 'Cancelar' del formulario
    this.dialogRef.close({statusResponse: false});
  }

  getProyecto()
  {
    this._proyectoService.getProyecto(this.data.idProyecto).subscribe(
      response => {
        console.log(response);
        this.proyecto = response.data;

        //Convierte la cadena de texto en un arreglo
        this.tagsArray = this.proyecto.tags.split(',');

        this.loading = false;  
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }
  
  getCategoriaProyecto()
  {
    this._proyectoService.getCategoriasProyecto().subscribe(
      response => {
        this.categorias = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  saveProyecto(formProyecto: NgForm)
  {
    console.log(formProyecto);
    if(formProyecto.invalid) {
      Object.values(formProyecto.controls).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    this.proyecto.idSocio = this.idSocioDesencriptado;
    this.proyecto.tags = this.tagsArray.toString(); 

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Espere',
      text: 'Guardando información'
    });
    Swal.showLoading();

    //Si el idProyecto existe
    if(this.proyecto.idProyecto)
    {
      //Actualiza los datos del Proyecto
      this._proyectoService.updateProyecto(this.proyecto).subscribe(
        response => {
          console.log(response);
          if(response.success == true)
          {
            //Cierra el modal de Angular Material y envia la propiedad 'statusResponse' con el valor de la respuesta (en este caso 'true')
            this.dialogRef.close({statusResponse: response.success});
            Swal.fire({
              icon: 'success',
              title: 'Datos actualizados correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar los datos',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        },
        error => {
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
    else //Si no existe el idProyecto
    {
      //Crea un nuevo registro de Proyecto
      this._proyectoService.createProyecto(this.proyecto).subscribe(
        response => {
          console.log(response);
          if(response.success == true)
          {
            //Cierra el modal de Angular Material y envia la propiedad 'statusResponse' con el valor de la respuesta (en este caso 'true')
            this.dialogRef.close({statusResponse: response.success});
            Swal.fire({
              icon: 'success',
              title: 'Datos guardados correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar los datos',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1',
            });
          }
        },
        error => {
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

  //Métodos para los Tags (Angular Material Chips)
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    //Agrega un nuevo tag
    if ((value || '').trim()) {
      this.tagsArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tagsArray.indexOf(tag);

    if (index >= 0) {
      this.tagsArray.splice(index, 1);
    }
  }
}
