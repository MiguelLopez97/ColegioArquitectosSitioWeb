import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocioModel } from '../../models/socio.model';
import { ProyectoModel } from '../../models/proyecto.model';
import { BusquedaInteligente } from '../../models/busquedaInteligente.model';
import { AsociacionService } from '../../services/asociacion.service';
import { SocioService } from '../../services/socio.service';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss'],
})
export class BusquedaComponent implements OnInit {
  public resultados: BusquedaInteligente[] = [];
  private originRoute: string;
  private categoria: string;
  private socios: SocioModel[] = [];
  private proyectos: ProyectoModel[] = [];
  public criterio: string = '';
  public busqueda: string;
  public loading: boolean;

  constructor(
    private _ar: ActivatedRoute,
    private _asociacionService: AsociacionService,
    private _socioService: SocioService,
    private _proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this._ar.params.subscribe((params) => {
      this.categoria = params['categoria'];
      this.busqueda = params['criterioBusqueda'];

      // Identificar si el criterio de búsqueda es de más de una palabra
      var arrayCriterio = this.busqueda.split(' ');
      var paramBusqueda = '';
      for (let i = 0; i < arrayCriterio.length; i++) {
        if (arrayCriterio.length > 0 && i < arrayCriterio.length)
          paramBusqueda += '&request.criterioDeBusqueda=' + arrayCriterio[i];
        else paramBusqueda += 'request.criterioDeBusqueda=' + arrayCriterio[i];
      }
      this.criterio = paramBusqueda;

      // console.log('this.categoria :>> ', this.categoria);
      // console.log('this.criterio :>> ', this.criterio);
      this.loading = true;
      this.getProyectos();
      this.buscar();
    });
  }

  buscar() {
    if (this.categoria === 't') {
      // Buscar en categoria 'TODOS'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, true, true, true, true, true)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractFileLink(this.resultados);
            this.extractSocioInfo(this.resultados);
            this.extractPrensaInfo(this.resultados);
            this.extractProyectoInfo(this.resultados);
            this.buildURLProyecto();
            this.loading = false;
            console.log('res Busqueda Todos', res.data);
          },
          (error) => {
            console.log('error Busqueda en Todos :>> ', error);
          }
        );
    } else if (this.categoria === 'a') {
      // Buscar en categoria 'AGENDA'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, true, false, false, false, false)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.loading = false;
            // console.log('res Busqueda Agenda', res.data);
          },
          (error) => {
            console.log('error Busqueda en Agenda :>> ', error);
          }
        );
    } else if (this.categoria === 'nr') {
      // Buscar en categoria 'NORMATECA'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, false, true, false, false, false)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractFileLink(this.resultados);
            this.loading = false;
            // console.log('res Busqueda Normateca', res.data);
          },
          (error) => {
            console.log('error Busqueda en Normateca :>> ', error);
          }
        );
    } else if (this.categoria === 'n') {
      // Buscar en categoria 'NOTICIAS/PRENSA'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, false, false, true, false, false)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractPrensaInfo(this.resultados);
            this.loading = false;
            // console.log('res Busqueda Noticia', res.data);
          },
          (error) => {
            console.log('error Busqueda en Noticia :>> ', error);
          }
        );
    } else if (this.categoria === 'p') {
      // Buscar en categoria 'PROYECTO'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, false, false, false, true, false)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractProyectoInfo(this.resultados);
            this.loading = false;
            // console.log('res Busqueda Proyecto', res.data);
          },
          (error) => {
            console.log('error Busqueda en Proyecto :>> ', error);
          }
        );
    } else if (this.categoria === 's') {
      // Buscar en categoria 'SOCIO'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, false, false, false, false, true)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractSocioInfo(this.resultados);
            this.loading = false;
            // console.log('res Busqueda Socio', res.data);
          },
          (error) => {
            console.log('error Busqueda en Socio :>> ', error);
          }
        );
    } else if (this.categoria === 'ps') {
      // Buscar en categoria 'PROYECTO' y 'SOCIO'
      this._asociacionService
        .getBusquedaInteligente(this.criterio, false, false, false, true, true)
        .subscribe(
          (res) => {
            this.resultados = res.data;
            this.extractProyectoInfo(this.resultados);
            this.buildURLProyecto();
            this.extractSocioInfo(this.resultados);
            this.loading = false;
            console.log('res Busqueda Proyecto/Socio', res.data);
          },
          (error) => {
            console.log('error Busqueda en Proyecto/Socio :>> ', error);
          }
        );
    }
  }

  extractFileLink(results: BusquedaInteligente[]) {
    results.map((resultado, index) => {
      if (resultado.categoria === 'Normateca') {
        const headTrim = resultado.texto2.substr(8);
        const tailTrim = headTrim.substr(0, headTrim.length - 3);
        this.resultados[index].texto2 = tailTrim;
      }
    });
  }

  extractSocioInfo(results: BusquedaInteligente[]) {
    results.map((resultado, index) => {
      if (resultado.categoria === 'Socio') {
        // Recortar ... e inicio de texto1 - NOMBRE COMPLETO
        const headTrimNombre = resultado.texto1.substr(9);
        const tailTrimNombre = headTrimNombre.substr(
          0,
          headTrimNombre.length - 3
        );
        this.resultados[index].texto1 = tailTrimNombre;
        // Recortar ... e inicio de texto2 - APODO
        const headTrimApodo = resultado.texto2.substr(6);
        const tailTrimApodo = headTrimApodo.substr(0, headTrimApodo.length - 3);
        this.resultados[index].texto2 = tailTrimApodo;
        // Recortar ... e inicio de texto3 - CURRICULUM
        const headTrimCurriculum = resultado.texto3.substr(11);
        const tailTrimCurriculum = headTrimCurriculum.substr(
          0,
          headTrimCurriculum.length - 3
        );
        this.resultados[index].texto3 = tailTrimCurriculum;
      }
    });
  }

  extractPrensaInfo(results: BusquedaInteligente[]) {
    results.map((resultado, index) => {
      if (resultado.categoria === 'Prensa') {
        // Recortar ... e inicio de texto1 - TITULO
        const headTrimTitulo = resultado.texto1.substr(7);
        this.resultados[index].texto1 = headTrimTitulo;
        // Recortar ... e inicio de texto2 - RESUMEN
        const headTrimResumen = resultado.texto2.substr(8);
        this.resultados[index].texto2 = headTrimResumen;
      }
    });
  }

  extractProyectoInfo(results: BusquedaInteligente[]) {
    results.map((resultado, index) => {
      if (resultado.categoria === 'Proyecto') {
        // Recortar ... e inicio de texto1 - TITULO
        const headTrimTitulo = resultado.texto1.substr(7);
        this.resultados[index].texto1 = headTrimTitulo;
        // Recortar ... e inicio de texto2 - DESCRIPCION
        const headTrimDescripcion = resultado.texto2.substr(41);
        this.resultados[index].texto2 = headTrimDescripcion;
        // Recortar ... e inicio de texto2 - Arquitectos
        const headTrimArquitectos = resultado.texto3.substr(12);
        this.resultados[index].texto3 = headTrimArquitectos;
      }
    });
    this.buildURLProyecto();
  }

  // Tener listado de todos los proyectos para posteriormente buscar el idUsuario para cada enlace en las tarjetas
  getProyectos() {
    this._proyectoService.getAllProyectos().subscribe(
      (res) => {
        console.log(res);
        this.proyectos = res.data;
      },
      (error) => {
        console.log('error getAllProyectos :>> ', error);
      }
    );
  }

  // Construir la url con el idSocio y el idProyecto para cada resultado con categoria idProyecto
  buildURLProyecto(): void {
    if (this.proyectos.length > 0) {
      // Recorrer cada resultado y modificar el webAPIUri para colocar la dirección
      this.resultados.map((resultado, index) => {
        const proyecto = this.proyectos.find(
          (proyecto) => proyecto.idProyecto === resultado.idRegistro
        );
        // Asignar a la constante idSocio el idUsuario perteneciente al proyecto en cuestión
        const idSocio = proyecto?.idUsuario;
        // Actualizar el webAPIUri para que tenga la dirección del proyecto con su idUsuario
        this.resultados[
          index
        ].webAPIUri = `/contratar-arquitecto/arquitecto/${idSocio}/proyecto/${resultado.idRegistro}`;
      });
    }
  }
}
