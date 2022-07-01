import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { CriptoService } from '../../../services/cripto.service';
import { PagosService } from '../../../services/pagos.service';
import { SocioService } from '../../../services/socio.service';
import { SocioModel } from '../../../models/socio.model';
import { PagoModel } from '../../../models/pago.model';

import Swal from 'sweetalert2';

declare var OpenPay: any;
declare var $: any;

@Component({
  selector: 'app-pago-linea',
  templateUrl: './pago-linea.component.html',
  styleUrls: ['./pago-linea.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class PagoLineaComponent implements OnInit {

  //Propiedad que muestra el 'loading' hasta que carguen los datos
  public loading: boolean = false;

  //Steps Angular Material
  @ViewChild('stepper') stepper: MatStepper;  
  public isLinear = true;

  //Propiedad para mostrar u ocultar el CVV
  public viewCVV: boolean = false;

  //Formularios reactivos
  public seleccionarConceptoForm: FormGroup;
  public infoPagoForm: FormGroup;

  //Propiedades para Socio
  public socio = new SocioModel();
  public idSocioDesencriptado: string;
  public userTypeId: number;

  //Propiedad para almacenar un arreglo de los productos Activos
  public productos: any[] = [];
  public productosTemp: any[] = [];

  //Propiedad para validar si debe pagar un curso o no
  public isPagoCurso: boolean;
  public seleccionarPrecio: boolean;

  //Propiedad que será enviada a la API de 'Pago'
  public pago = new PagoModel();

  //Propiedades para almacenar datos de OpenPay.js
  public deviceSessionId;

  //Propiedades para almacenar y mostrar los datos de la tarjeta en 'Detalle de la tarjeta' cuando la API de Openpay responda con status 200
  public resultNumeroTarjeta: string;
  public resultMarca: string;
  public resultMesExpiracion: string;
  public resultAnioExpiracion: string;
  public resultBancoEmisor: string;

  //Arreglos para la información de Pago
  public meses = [
    {idMes: '01', mes: 'Enero'},
    {idMes: '02', mes: 'Febrero'},
    {idMes: '03', mes: 'Marzo'},
    {idMes: '04', mes: 'Abril'},
    {idMes: '05', mes: 'Mayo'},
    {idMes: '06', mes: 'Junio'},
    {idMes: '07', mes: 'Julio'},
    {idMes: '08', mes: 'Agosto'},
    {idMes: '09', mes: 'Septiembre'},
    {idMes: '10', mes: 'Octubre'},
    {idMes: '11', mes: 'Noviembre'},
    {idMes: '12', mes: 'Diciembre'}
  ];

  public anios = [
    {idAnio: '21', anio: '2021'},
    {idAnio: '22', anio: '2022'},
    {idAnio: '23', anio: '2023'},
    {idAnio: '24', anio: '2024'},
    {idAnio: '25', anio: '2025'},
    {idAnio: '26', anio: '2026'},
    {idAnio: '27', anio: '2027'},
    {idAnio: '28', anio: '2028'},
    {idAnio: '29', anio: '2029'},
    {idAnio: '30', anio: '2030'},
    {idAnio: '31', anio: '2031'},
    {idAnio: '32', anio: '2032'},
    {idAnio: '33', anio: '2033'},
  ];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _criptoService: CriptoService,
    private _pagosService: PagosService,
    private _socioService: SocioService,
    private _formBuilder: FormBuilder
  ) { 
    this.idSocioDesencriptado = this._criptoService.decrypt(localStorage.getItem('idSocio'));
    this.userTypeId = this._criptoService.decrypt(localStorage.getItem('userTypeId'));
    this.buildForms();
  }

  ngOnInit(): void {
    this.loading = true;

    this.getProductosActivos();
    this.getSocio();

    //Escucha los cambios que se hacen en el select de 'Seleccionar Precio'
    this.filterPreciosProducto();

    //Escucha los cambios que se hacen en el select de 'Seleccione un concepto a pagar'
    this.changeProductoReactiveForm();

    //Configuración del Id de Comercio y Llave Pública para poder utilizar OpenPay.js (Modo Sandbox)
    OpenPay.setId('mxenorsjm0jzmngjbekp');
    ​OpenPay.setApiKey('pk_747bf3e3fd8b4e5aa46796dc2c4f8581');

    //Configuración del Id de Comercio y Llave Pública para poder utilizar OpenPay.js (Modo Producción)
    //OpenPay.setId('mzstvuhjd5ptryfdb7ax');
    //​OpenPay.setApiKey('pk_e4bd6127164f4365aed1696fc66137c5');

    OpenPay.setSandboxMode(true);

    //Inicialización del valor para el 'device_session_id'
    this.deviceSessionId = OpenPay.deviceData.setup("processCard", "deviceIdHiddenFieldName");
  }

  get conceptoNoValido() {
    //return this.seleccionarConceptoForm.get('concepto').hasError('required');
    return this.seleccionarConceptoForm.get('concepto').invalid && this.seleccionarConceptoForm.get('concepto').touched;
  }

  get precioNoValido() {
    //return this.seleccionarConceptoForm.get('precio').hasError('required');
    return this.seleccionarConceptoForm.get('precio').invalid && this.seleccionarConceptoForm.get('precio').touched;
  }

  get tarjetaNoValida() {
    //return this.infoPagoForm.get('numeroTarjeta').hasError('required');
    return this.infoPagoForm.get('numeroTarjeta').invalid && this.infoPagoForm.get('numeroTarjeta').touched;
  }

  get anioExpiracionNoValido() {
    //return this.infoPagoForm.get('anioExpiracion').hasError('required');
    return this.infoPagoForm.get('anioExpiracion').invalid && this.infoPagoForm.get('anioExpiracion').touched;
  }

  get mesExpiracionNoValido() {
    //return this.infoPagoForm.get('mesExpiracion').hasError('required');
    return this.infoPagoForm.get('mesExpiracion').invalid && this.infoPagoForm.get('mesExpiracion').touched;
  }  

  get cvvNoValido() {
    //return this.infoPagoForm.get('cvv').hasError('required');
    return this.infoPagoForm.get('cvv').invalid && this.infoPagoForm.get('cvv').touched;
  }
  
  //Crea los formularios reactivos para seleccionar el concepto y para rellenar la información del pago
  buildForms()
  {
    //Formulario 1 - Seleccionar un concepto
    this.seleccionarConceptoForm = this._formBuilder.group({
      concepto: ['', Validators.required],
      precio: ['', Validators.required]
    });

    //Formulario 2 - Información de pago
    this.infoPagoForm = this._formBuilder.group({
      nombreTitular: [{value: '', disabled: true}],
      numeroTarjeta: ['', Validators.required],
      anioExpiracion: ['', Validators.required],
      mesExpiracion: ['', Validators.required],
      cvv: ['', Validators.required],
      calle: [{value: '', disabled: true}],
      numero: [{value: '', disabled: true}],
      colonia: [{value: '', disabled: true}],
      codigoPostal: [{value: '', disabled: true}],
      ciudad: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
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

  getProductosActivos()
  {
    this._pagosService.getProductosActivos(this.idSocioDesencriptado).subscribe(
      response => {
        console.log(response);
        this.productos = response.data;
        this.productosTemp = this.productos;
        this.loading = false;

        //Obtiene el parámetro de la URL para settear el valor al select de 'Seleccione un Concepto'
        this._route.params.subscribe(params => {
          //Si hay idProducto por la URL
          if (params.idProducto != null)
          {
            //Filtra sólo el producto en base al 'idProducto' que llegue en la URL
            this.productos = this.productos.filter(prod => prod.idProducto == params.idProducto);
            //Asigna el 'idProducto' que viene de la URL al select 'Concepto' para que aparezca seleccionado el producto
            this.seleccionarConceptoForm.setValue({
              concepto: params.idProducto,
              precio: this.productos[0].precioSocio
            });
          } 

          //Verifica si en el url viene algún parámetro tipo query
          this._route.queryParams.subscribe(
            params => {
              //Si existe el parámetro 'curso' en la URL
              if (params.curso)
              {
                //'this.isPagoCurso' se marca como verdadero para mostrar una vista diferente
                this.isPagoCurso = true;
              }
              else
              {
                //'this.isPagoCurso' se marca como falso para mostrar una vista diferente
                this.isPagoCurso = false;
              }
            }
          );


          //Si el userTypeId es igual a 5 (Externo)
          if (this.userTypeId == 5)
          {
            this.seleccionarPrecio = true;

            //Sólo selecciona el concepto del producto para que aparezca seleccionado sin el precio
            this.seleccionarConceptoForm.setValue({
              concepto: params.idProducto,
              precio: ''
            });
          }
        });
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  getSocio()
  {
    this._socioService.getSocioEdicion(this.idSocioDesencriptado).subscribe(
      response => {
        console.log(response);
        this.socio = response.data;
        if(response.success == true)
        {
          this.cargarDataAlFormularioPago();
        }
      },
      error => {
        console.log(error);        
      }
    );
  }  

  cargarDataAlFormularioPago()
  {
    var fullNameSocio = this.socio.nombreCompleto + " " + this.socio.apellidoPat + " " + this.socio.apellidoMat;
    this.infoPagoForm.patchValue({
      nombreTitular: fullNameSocio,
      numeroTarjeta: '',
      anioExpiracion: '',
      mesExpiracion: '',
      cvv: '',
      calle: this.socio.calle,
      numero: this.socio.numero,
      colonia: this.socio.colonia,
      codigoPostal: this.socio.codigoPostal,
      ciudad: this.socio.ciudad,
      estado: this.socio.estado,
    });
  }
  
  validatePago()
  {
    if(this.infoPagoForm.invalid) {
      Object.values(this.infoPagoForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Validando datos',
      text: 'Un momento, por favor'
    });
    Swal.showLoading();

    OpenPay.token.extractFormAndCreate(
      $('#processCard'),
      response => {
        console.log(response);
        Swal.close();

        //Se asigna el id de la transacción a la propiedad 'tokenId'
        this.pago.tokenId = response.data.id;

        //Si la respuesta de la API de Openpay es 200(success)
        if (response.status == 200)
        {
          //Almacena los datos de la respuesta para mostrarlos en 'Detalle de la tarjeta'
          this.resultNumeroTarjeta = response.data.card.card_number;
          this.resultMesExpiracion = response.data.card.expiration_month;
          this.resultAnioExpiracion = response.data.card.expiration_year;
          switch(response.data.card.brand)
          {
            case 'visa': {this.resultMarca = "Visa"; break;}
            case 'mastercard': {this.resultMarca = "MasterCard"; break;}
            case 'american_express': {this.resultMarca = "AmericanExpress"; break;}
            case 'carnet': {this.resultMarca = "Carnet"; break;}
            default: {this.resultMarca = "Otros"; break;}
          }
          this.resultBancoEmisor = response.data.card.points_type;

          //Continua al siguiente paso de Angular Stepper
          this.stepper.next();
        }
      },
      error => {
        console.log(error);
        var codeError = error.data.error_code;
        var messageError;
        switch(codeError) 
        {
          //Código de errores de la documentación de Openpay (https://www.openpay.mx/docs/errors.html)
          case 1000: { messageError = "Ocurrió un error interno en el servidor de Openpay"; break; }
          case 1001: {
            if (error.data.description == "cvv2 length must be 3 digits")
            {
              messageError = "La longitud de CVV debe ser de 3 dígitos"; break;
            }
            else if (error.data.description == "cvv2 length must be 4 digits")
            {
              messageError = "La longitud de CVV debe ser de 4 dígitos"; break;
            }
            else if (error.data.description == "card_number length is invalid")
            {
              messageError = "La longitud del número de tarjeta debe ser de 16 dígitos"; break;
            }
            else
            {
              messageError = error.data.description; break;
            }
          }
          case 1002: { messageError = "La llamada no está autenticada o la autenticación es incorrecta"; break; }
          case 1003: { messageError = "La operación no se pudo completar por que el valor de uno o más de los parámetros no es correcto"; break; }
          case 1004: { messageError = "Un servicio necesario para el procesamiento de la transacción no se encuentra disponible"; break; }
          case 1005: { messageError = "Uno de los recursos requeridos no existe"; break; }
          case 1006: { messageError = "Ya existe una transacción con el mismo ID de orden"; break; }
          case 1007: { messageError = "La transferencia de fondos entre una cuenta de banco o tarjeta y la cuenta de Openpay no fue aceptada"; break; }
          case 1008: { messageError = "Una de las cuentas requeridas en la petición se encuentra desactivada"; break; }
          case 1009: { messageError = "El cuerpo de la petición es demasiado grande"; break; }
          case 1010: { messageError = "Se esta utilizando la llave pública para hacer una llamada que requiere la llave privada, o bien, se esta usando la llave privada desde JavaScript"; break; }
          case 1011: { messageError = "Se solicita un recurso que está marcado como eliminado"; break; }
          case 1012: { messageError = "El monto transacción está fuera de los límites permitidos"; break; }
          case 1013: { messageError = "La operación no está permitida para el recurso"; break; }
          case 1014: { messageError = "La cuenta está inactiva"; break; }
          case 1015: { messageError = "No se ha obtenido respuesta de la solicitud realizada al servicio"; break; }
          case 1016: { messageError = "El mail del comercio ya ha sido procesada"; break; }
          case 1017: { messageError = "El gateway no se encuentra disponible en este momento"; break; }
          case 1018: { messageError = "El número de intentos de cargo es mayor al permitido"; break; }        
          case 1020: { messageError = "El número de dígitos decimales es inválido para esta moneda"; break; }
          case 2001: { messageError = "La cuenta de banco con esta CLABE ya se encuentra registrada en el cliente"; break; }
          case 2003: { messageError = "El cliente con este identificador externo (External ID) ya existe"; break; }
          case 2004: { messageError = "El número de tarjeta es inválido"; break; }
          case 2005: { messageError = "La fecha de expiración de la tarjeta es anterior a la fecha actual"; break; }
          case 2006: { messageError = "El código de seguridad de la tarjeta (CVV2) no fue proporcionado"; break; }
          case 2007: { messageError = "El número de tarjeta es de prueba, solamente puede usarse en Sandbox"; break; }
          case 2008: { messageError = "La tarjeta no es válida para pago con puntos"; break; }
          case 2009: { messageError = "El código de seguridad de la tarjeta (CVV2) es inválido"; break; }
          case 2010: { messageError = "Autenticación 3D Secure fallida"; break; }
          case 2011: { messageError = "Tipo de tarjeta no soportada"; break; }
          case 3001: { messageError = "La tarjeta fue declinada por el banco"; break; }
          case 3002: { messageError = "La tarjeta ha expirado"; break; }
          case 3003: { messageError = "La tarjeta no tiene fondos suficientes"; break; }
          case 3004: { messageError = "La tarjeta ha sido identificada como una tarjeta robada"; break; }
          case 3005: { messageError = "La tarjeta ha sido rechazada por el sistema antifraude. Rechazada por coincidir con registros en lista negra"; break; }
          case 3006: { messageError = "La operación no está permitida para este cliente o esta transacción"; break; }
          case 3009: { messageError = "La tarjeta fue reportada como perdida"; break; }
          case 3010: { messageError = "El banco ha restringido la tarjeta"; break; }
          case 3011: { messageError = "El banco ha solicitado que la tarjeta sea retenida. Contacte al banco"; break; }
          case 3012: { messageError = "Se requiere solicitar al banco autorización para realizar este pago"; break; }
          case 3201: { messageError = "Comercio no autorizado para procesar pago a meses sin intereses"; break; }
          case 3203: { messageError = "Promoción no válida para este tipo de tarjetas"; break; }
          case 3204: { messageError = "El monto de la transacción es menor al mínimo permitido para la promoción"; break; }
          case 3205: { messageError = "Promoción no permitida"; break; }
          case 4001: { messageError = "La cuenta de Openpay no tiene fondos suficientes"; break; }
          case 4002: { messageError = "La operación no puede ser completada hasta que sean pagadas las comisiones pendientes"; break; }
          default: { messageError = "Error desconocido. Contacte al administrador del sistema"; break; }
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: messageError,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }

  savePago()
  {
    //Datos a enviar a la API 'Pagos'
    this.pago.name = this.socio.nombreCompleto;
    this.pago.lastName = this.socio.apellidoPat + ' ' + this.socio.apellidoMat;
    this.pago.phoneNumber = this.socio.telefonoMovil;
    this.pago.email = this.socio.correoElectronico;
    this.pago.idSocio = this.socio.idSocio;
    this.pago.deviceSessionId = this.deviceSessionId;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Procesando pago',
      text: 'Un momento, por favor'
    });
    Swal.showLoading();

    this._pagosService.createPago(this.pago).subscribe(
      response => {
        console.log(response);

        if (response.success == true)
        {
          //Guardamos los datos del Pago en el localStorage para mostrar los detalles en la próxima pantalla
          localStorage.setItem('pago', JSON.stringify(this.pago));

          //Redirigimos a la url del redirect que devuelve la API
          window.location = response.id;

          /* Swal.fire({
            icon: 'success',
            title: 'Operación exitosa',
            html: '<small><b>Folio: <b></small> <small>' + this.pago.tokenId +'</small><br>' +
                  '<small><b>Estatus de la transacción: <b></small> <small>Completada</small><br><br>' +
                  '<small><b>Detalle del pago: <b></small><br>'+
                  '<small><b>Concepto: <b></small> <small>' + this.pago.producto +'</small><br>' +
                  '<small><b>Precio: <b></small> <small>' + this.pago.amount +'</small><br><br>' +
                  '<small>Conserve su folio para dudas y/o aclaraciones</small>',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#2054A1',
          });
          this._router.navigate(['/historial-pagos']); */
        }
        else
        {
          Swal.fire({
            icon: 'error',
            title: 'Transacción fallida',
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
          title: 'Transacción fallida',
          text: error.error.message,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2054A1',
        });
      }
    );
  }

  //Cambia el nombre del producto y el precio del producto en base al producto elegido
  changeProductoReactiveForm() 
  {
    //Asigna a las propiedades idProducto, producto y descripción los valores que se estén seleccionando en el select de 'Conceptos'
    this.seleccionarConceptoForm.valueChanges.subscribe(value => {
      this.pago.idProducto = this.productos.find(prod => prod.idProducto == value.concepto).idProducto;
      this.pago.producto = this.productos.find(prod => prod.idProducto == value.concepto).descripcion;
      this.pago.description = this.productos.find(prod => prod.idProducto == value.concepto).descripcion;

      //Asigna a la propiedad 'amount' el valor que se esté seleccionando en el select 'Precio'
      if (value.precio != '')
      {
        this.pago.amount = value.precio.toFixed(2); //Limita los decimales a 2
      }
    });

    //Asigna a la propiedad 'amount' el valor que se esté seleccionando en el select 'Precio'
    /* this.seleccionarConceptoForm.get('precio').valueChanges.subscribe(value => {
      this.pago.amount = value.toFixed(2); //Limita los decimales a 2
      console.log(value);
      console.log(this.pago.amount);
    }); */
  }

  //Filtra el producto en base al 'concepto' (idProducto) que se elija y lo muestra en el select 'Precio'
  filterPreciosProducto()
  {
    this.seleccionarConceptoForm.get('concepto').valueChanges.subscribe(value => {

      //Si existe valor en el campo 'Precio'
      if (this.seleccionarConceptoForm.get('precio') != null)
      {
        //Seteamos el precio vacio para cuando se seleccione otro concepto, no se mantenga el precio del producto anterior
        this.seleccionarConceptoForm.patchValue({
          precio: ''
        });
      }
      this.productosTemp = this.productos.filter(prod => prod.idProducto == value);
    });  
  }
}
