import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SeoService } from 'src/app/services/seo.service';
import { CursosService } from '../../services/cursos.service';
import { CursoModel, CursoTemporalModel } from '../../models/curso.model';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent extends SeoService implements OnInit {

  public cursos: CursoModel[] = [];
  public cursosTemporal: CursoTemporalModel[] = [];

  public imgTemporal = 'https://api.arquitab.org.mx/Content/files/flyers//38.jpg?t=44396.4622337963';
  public loading: boolean = true;

  constructor(
    private _cursosService: CursosService,
    private titleService: Title,
    private metaService: Meta
  ) { 
    super(titleService, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Cursos', 'cursos');

    this.getAllCursos();
  }

  getAllCursos()
  {
    this._cursosService.getAllCursos().subscribe(
      response => {
        console.log(response);
        this.cursos = response.data;
        this.separateCursos();
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  separateCursos()
  {
    // for (let i = 0; i < this.cursos.length; i++)
    for (let index in this.cursos)
    {
      //Extraer mes y anio
      const mes = +this.cursos[index].fechaInicio.split('-')[1];
      const anio = +this.cursos[index].fechaInicio.split('-')[0];

      // Comprobar si el arreglo de 'cursosTemporal' esta vacío
      if (this.cursosTemporal.length == 0)
      {
        //Si 'this.cursosTemporal' esta vacío, insertar el mes con el curso
        //Utilizar mes y anio como id único
        const cursoTemp = {
          idMes: +`${mes}${anio}`,
          mes: this.setNameMes(mes),
          anio: anio,
          cursosPorMes: [this.cursos[index]],
        };
        this.cursosTemporal.push(cursoTemp);
      }
      else
      {
        //Buscar si ya existe el mes y anio del objeto actual
        const yaExisteIndex = this.cursosTemporal.findIndex(
          (a) => a.idMes === +`${mes}${anio}`
        );
        if (yaExisteIndex >= 0) 
        {
          // Si 'this.cursosTemporal' no esta vacío y ya existe el mes y anio, simplemente insertar en su arreglo 'cursos'
          this.cursosTemporal[yaExisteIndex].cursosPorMes.push(this.cursos[index]);
        }
        else
        {
          //Si 'this.cursosTemporal' no esta vacío y no existe el mes y anio, insertar el mes y anio con el evento
          //Utilizar mes y anio como id unico
          const cursoTemp = {
            idMes: +`${mes}${anio}`,
            mes: this.setNameMes(mes),
            anio: anio,
            cursosPorMes: [this.cursos[index]],
          };
          this.cursosTemporal.push(cursoTemp);
        }
      }

      // Ordenar por anio
      const sortByYear = (periodo: CursoTemporalModel[]) =>
        periodo.sort((mesA: CursoTemporalModel, mesB: CursoTemporalModel) => {
          if (mesA.anio > mesB.anio) return 1;
          if (mesA.anio < mesB.anio) return -1;
          return 0;
        });

      // Ordenar por mes
      const sortByMonth = (periodo: CursoTemporalModel[]) =>
        periodo.sort((mesA: CursoTemporalModel, mesB: CursoTemporalModel) => {
          if (mesA.idMes < mesB.idMes) return 1;
          return 0;
        });

      this.cursosTemporal = sortByYear(this.cursosTemporal);
      this.cursosTemporal = sortByMonth(this.cursosTemporal);
    }

    //Ordenamos los cursos por fecha del más reciente al más antiguo (una vez se hayan ordenado por Año y por Mes)
    for (let cursoTemp of this.cursosTemporal)
    {
      cursoTemp.cursosPorMes = cursoTemp.cursosPorMes.sort((a, b):any => new Date(a.fechaInicio).getTime() < new Date(b.fechaInicio).getTime());
    }
  }

  setNameMes(numberMes: number)
  {
    switch (numberMes)
    {
      case 1: { return "Enero"; break; }
      case 2: { return "Febrero"; break; }
      case 3: { return "Marzo"; break; }
      case 4: { return "Abril"; break; }
      case 5: { return "Mayo"; break; }
      case 6: { return "Junio"; break; }
      case 7: { return "Julio"; break; }
      case 8: { return "Agosto"; break; }
      case 9: { return "Septiembre"; break; }
      case 10: { return "Octubre"; break; }
      case 11: { return "Noviembre"; break; }
      case 12: { return "Diciembre"; break; }
    }
  }

}
