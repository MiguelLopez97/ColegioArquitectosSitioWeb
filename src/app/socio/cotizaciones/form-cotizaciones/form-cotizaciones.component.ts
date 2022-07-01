import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProyectoService } from '../../../services/proyecto.service';
import { CriptoService } from '../../../services/cripto.service';
import { SocioService } from '../../../services/socio.service';
import { CotizacionModel } from '../../../models/cotizacion.model';

import * as printJS from 'print-js';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-cotizaciones',
  templateUrl: './form-cotizaciones.component.html',
  styleUrls: ['./form-cotizaciones.component.scss']
})
export class FormCotizacionesComponent implements OnInit {

  public loading: boolean = true;

  //Propiedad para emitir después de crear una cotización (Para que quede seleccionada la pestaña 'Historial')
  @Output() indexEmitido = new EventEmitter();

  public cotizacionForm: FormGroup;
  public arancelForm: FormGroup;

  public cotizacion = new CotizacionModel();
  public calculoCotizacion = new CotizacionModel();
  public resultCalculoCotizacion: any;

  public importeTotalArancel: number;
  public arancelTotalIVA: number;
  public importeNeto: number;
  public porcentajeCAT: number;  

  public factorDeCalidad: any[] = [];

  public fullNameSocioDesencriptado: string;
  public idSocioDesencriptado: string;

  public displayedColumns: string[] = ['corresponsal', 'montoArancel', 'porcentaje'];
  public dataSource = new MatTableDataSource<any>();

  //Datos para mostrar en el PDF
  public obra: string;
  public ubicacion: string;
  public propietario: string;
  public indiceArancel: string;
  public smv: number;
  public dro: number;
  public currentDate: Date = new Date();

  public idCotizacion: number;
  
  //Texto para el botón de guardar los datos
  public textButton: string;

  public usoDeObra: any[] = [
    { idUsoDeObra: 1, uso: "VIVIENDA UNIFAMILIAR" } ,
    { idUsoDeObra: 2, uso: "VIVIENDA MULTIFAMILIAR PLURIFAMILIAR O CONJUNTOS" } ,
    { idUsoDeObra: 3, uso: "EDIFICIOS COMERCIALES O MIXTOS" } ,
    { idUsoDeObra: 4, uso: "HOTEL ZONA URBANA" } ,
    { idUsoDeObra: 5, uso: "ZONA INDUSTRIAL" } ,
    { idUsoDeObra: 6, uso: "EDIFICIOS PÚBLICOS" }
  ];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _proyectoService: ProyectoService,
    private _socioService: SocioService,
    private cripto: CriptoService  
  ) { 
    this.fullNameSocioDesencriptado = this.cripto.decrypt(localStorage.getItem('fullName'));
    this.idSocioDesencriptado = this.cripto.decrypt(localStorage.getItem('idSocio'));
    this.buildForm();
  }

  ngOnInit(): void {
    this.getSocio();
    // this.getCotizacion();

    //Escucha los cambios que se realizan en el input de 'Importe total de Aranceles'
    this.changeImporteTotalArancel();

    this.changeValuesCotizacionForm();

    //Si viene el idCotizacion por la URL, consulta el registro de la cotización
    this._route.params.subscribe(
      params => {
        this.idCotizacion = params.idCotizacion;
        if (params.idCotizacion)
        {
          this.getCotizacion(params.idCotizacion);
          this.textButton = 'Actualizar cotización';
        }
        else
        {
          this.loading = false;
          this.textButton = 'Guardar cotización';
        }
      }
    );
  }

  getSocio()
  {
    this._socioService.getSocio(Number(this.idSocioDesencriptado)).subscribe(
      response => {
        //console.log(response);
        this.dro = response.data.dro;
      },
      error => {
        console.log(error);
      }
    );
  }

  buildForm()
  {
    //Form 1 - Formulario de la cotización
    this.cotizacionForm = this._formBuilder.group({
      propietario: ['', Validators.required],
      idUsoDeObra: ['', Validators.required],
      idFactorDeCalidad: ['', Validators.required],
      nombreObra: ['', Validators.required],
      ubicacion: ['', Validators.required],
      metros2: ['', Validators.required],
      indiceTablaArancel: [{value: '', disabled: true}],
      salarioMinimoVigente: [141.70, Validators.required]
    });

    //Form 2 - Formulario 'Arancel de Tarifas Minimas para DRO'
    this.arancelForm = this._formBuilder.group({
      importeTotalArancel: [''],
    });
  }

  get propietarioNoValido() {
    return this.cotizacionForm.get('propietario').hasError('required');
  }

  get usoObraNoValido() {
    return this.cotizacionForm.get('idUsoDeObra').hasError('required');
  }

  get factorNoValido() {
    return this.cotizacionForm.get('idFactorDeCalidad').hasError('required');
  }

  get nombreObraNoValido() {
    return this.cotizacionForm.get('nombreObra').hasError('required');
  }

  get ubicacionNoValido() {
    return this.cotizacionForm.get('ubicacion').hasError('required');
  }

  get metrosNoValido() {
    return this.cotizacionForm.get('metros2').hasError('required');
  }

  //Valida que las teclas pulsadas sean únicamente números y la tecla para el punto (para los decimales)
  validaNumeros(event)
  {    
    if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode == 46)
    {
      return true;
    }
    return false; 
  }

  getCotizacion(idCotizacion?)
  {
    this._proyectoService.getCotizacion(idCotizacion).subscribe(
      response => {
        console.log(response);
        this.cotizacion = response.data;
        console.log(this.cotizacion);

        this.cargarDataAlFormulario();
        this.loading = false;

        //Multiplica el arancelTotal por el 16% (0.16) para obtener el IVA
        //this.arancelTotalIVA = this.cotizacion.arancelTotal * 0.16;

        //Suma el IVA obtenido anteriormente y el arancelTotal
        //this.importeNeto = this.cotizacion.arancelTotal + this.arancelTotalIVA;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  cargarDataAlFormulario()
  {
    //Formulario 1: Datos de la Cotización
    this.cotizacionForm.patchValue({
      propietario: this.cotizacion.propietario,
      idUsoDeObra: this.cotizacion.idUsoObra,
      idFactorDeCalidad: this.cotizacion.idFactor,
      nombreObra: this.cotizacion.obra,
      ubicacion: this.cotizacion.ubicacion,
      metros2: this.cotizacion.superficie,
      indiceTablaArancel: this.cotizacion.valorFactor
    });

    //Llama al API de 'getFactorCalidad' para dejar por defecto el valor del select 'Factor de Calidad'
    this.onChangeFactorCalidad(this.cotizacion.idUsoObra);

    //Formulario 2: Datos de arancel de tarifas
    this.arancelForm.patchValue({
      importeTotalArancel: this.cotizacion.arancelTotal
    });

    //Detalles de la tabla 'Tarifas para corresponsables'
    this.dataSource.data = this.cotizacion.detalle;
  }

  onChangeFactorCalidad(event)
  {
    let idUsoDeObra = event;
    
    this._proyectoService.getFactorCalidad(idUsoDeObra).subscribe(
      response => {
        this.factorDeCalidad = response.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  calcularAranceles()
  {
    if (this.cotizacionForm.invalid) {
      Object.values(this.cotizacionForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.calculoCotizacion.idUsoObra = this.cotizacionForm.get('idUsoDeObra').value;
    this.calculoCotizacion.idFactor = this.cotizacionForm.get('idFactorDeCalidad').value;
    this.calculoCotizacion.metros2 = this.cotizacionForm.get('metros2').value;
    this.calculoCotizacion.salarioMinimoVigente = this.cotizacionForm.get('salarioMinimoVigente').value;    

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Realizando cálculo'
    });
    Swal.showLoading();

    this._proyectoService.getCalculoAranceles(this.calculoCotizacion).subscribe(
      response => {
        console.log(response);

        //Asigna el valor 'factor' de la respuesta de la API al input 'Índice a aplicar según tabla de arancel'
        this.cotizacionForm.patchValue({
          indiceTablaArancel: response.data.factor
        });

        //Asigna el valor 'factor' de la respuesta de la API a la propiedad 'indiceArancel'
        this.indiceArancel = response.data.factor;

        //Asigna el valor 'totalArancel' de la respuesta de la API al input 'Importe total de aranceles'
        this.arancelForm.patchValue({
          importeTotalArancel: response.data.totalArancel
        });

        //Almacena la respuesta del cálculo de la API en la propiedad 'resultCalculoCotizacion'
        this.resultCalculoCotizacion = response.data;

        //Asigna el arreglo 'corresponsales' al dataSource de la tabla de Angular Material
        this.dataSource.data = this.resultCalculoCotizacion.corresponsales;

        //Asigna el valor total del arancel a la propiedad 'importeTotalArancel'
        this.importeTotalArancel = this.resultCalculoCotizacion.totalArancel;
        
        //Multiplica el importeTotalArancel por el 16% (0.16) para obtener el IVA
        this.arancelTotalIVA = this.importeTotalArancel * 0.16;

        //Suma el IVA obtenido anteriormente y el importeTotalArancel
        this.importeNeto = this.importeTotalArancel + this.arancelTotalIVA;

        //Asigna el arancelCAT a la propiedad 'porcentajeCAT'
        this.porcentajeCAT = this.resultCalculoCotizacion.arancelCAT;

        Swal.fire({
          icon: 'success',
          title: 'Cálculo realizado correctamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1'
        });
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar el cálculo',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1'
        });
      }
    );
  }

  //Obtiene el valor que tenga el input 'importeTotalArancel'
  changeImporteTotalArancel()
  {
    this.arancelForm.get('importeTotalArancel').valueChanges.subscribe(value => {

      //Cambia el valor total por el que se ingrese en el input 'Importe total de aranceles'
      this.importeTotalArancel = value;

      //Multiplica el importeTotalArancel por el 16% (0.16) para obtener el IVA
      this.arancelTotalIVA = value * 0.16;

      //Suma el IVA obtenido anteriormente y el importeTotalArancel
      this.importeNeto = this.arancelTotalIVA + Number(value);

      //Cambia el valor del porcentaje del CAT en base al valor que se ingrese en el input 'Importe total de aranceles'
      this.porcentajeCAT = value * 0.10;
    });
  }

  changeValuesCotizacionForm()
  {
    this.cotizacionForm.valueChanges.subscribe(
      value => {
        this.obra = value.nombreObra;
        this.ubicacion = value.ubicacion;
        this.propietario = value.propietario;
        this.smv = value.salarioMinimoVigente;
      }
    );
  }

  saveCotizacion()
  {
    //Verificamos que se hayan rellenado los campos para la cotización
    if (this.cotizacionForm.invalid) {
      Object.values(this.cotizacionForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      title: 'Espere',
      text: 'Guardando datos'
    });
    Swal.showLoading();
    
    var cotizacion = new CotizacionModel();

    cotizacion.idCotizacion = Number(this.idCotizacion);
    cotizacion.idSocio = Number(this.idSocioDesencriptado);
    cotizacion.idUsoObra = this.cotizacionForm.get('idUsoDeObra').value;
    cotizacion.idFactor = this.cotizacionForm.get('idFactorDeCalidad').value;
    cotizacion.superficie = this.cotizacionForm.get('metros2').value;
    cotizacion.smv = this.smv;
    cotizacion.valorFactor = this.cotizacionForm.get('indiceTablaArancel').value;
    cotizacion.arancelTotal = this.arancelForm.get('importeTotalArancel').value;
    cotizacion.folio = this.cotizacion.folio;
    cotizacion.obra = this.obra;
    cotizacion.propietario = this.propietario;
    cotizacion.ubicacion = this.ubicacion;

    //Si existe el idCotizacion por la URL
    if(this.idCotizacion)
    {
      //Actualiza el registro
      this._proyectoService.updateCotizacion(cotizacion).subscribe(
        response => {
          console.log(response);
          if (response.success == true)
          {
            //Nos dirigimos a la ruta de 'Cotizaciones'
            this._router.navigate(['/cotizaciones']);

            Swal.fire({
              icon: 'success',
              title: 'Cotización actualizada correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1'
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar la cotización',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1'
            });
          }
        },
        error => { 
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar la cotización',
            text: error.error.message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1'
          });
        }
      );
    }
    else
    {
      //Crea un nuevo registro
      this._proyectoService.createCotizacion(cotizacion).subscribe(
        response => {
          console.log(response);
          if (response.success == true)
          {
            //Emitimos 1 como index para los Tabs de la pantalla de 'Cotizaciones'
            //Para que se seleccione la pestaña 'Historial' después de crear una cotización
            this.indexEmitido.emit(1);

            Swal.fire({
              icon: 'success',
              title: 'Cotización guardada correctamente',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1'
            });
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar la cotización',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#2054A1'
            });
          }
        },
        error => { 
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar la cotización',
            text: error.error.message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1'
          });
        }
      );
    }
  }

  imprimirPDF()
  {
    //Verificamos que se hayan rellenado los campos para la cotización
    if (this.cotizacionForm.invalid) {
      Object.values(this.cotizacionForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    console.log('valid form');

    //Obtiene la fecha actual para adjuntarla como nombre de archivo
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    var today;

    if (month < 10)
    {
      today = day + '-0' + month + '-' + year;
    }
    else
    {
      today = day + '-' + month + '-' + year;
    }

    printJS({ 
      printable: 'pruebaJS', 
      type: 'html',
      documentTitle: 'Cotización_CAT_' + today,
      scanStyles: false,
      targetStyles: ['*'],
      style: '@page {size: landscape !important;} .pagebreak {clear: both; page-break-after: always;} #pruebaJS {font-family: Helvetica;} .table-factor, .table-factor tr, .table-factor th, .table-factor td {border: 1px solid black !important; border-collapse: collapse !important;}'
    })


  }

}
