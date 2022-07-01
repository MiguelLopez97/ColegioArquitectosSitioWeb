import { Component, OnInit } from '@angular/core';
import { EventoModel, AgendaModel, AgendaTemporalModel } from '../../models/agenda.model';
import { AsociacionService } from '../../services/asociacion.service';
import { SeoService } from 'src/app/services/seo.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent extends SeoService implements OnInit {
  public eventos: EventoModel[] = [];
  public agenda: AgendaModel[] = [];
  public agendaTemporal: AgendaTemporalModel[] = [];
  currentYear: number = new Date().getFullYear();
  public loading: boolean = false;

  constructor(
    private _asociacionService: AsociacionService,
    private titleSerive: Title,
    private metaService: Meta
  ) {
    super(titleSerive, metaService);
  }

  ngOnInit(): void {
    this.updateTags('Agenda', 'agenda');

    this.loading = true;
    this.getAgenda();
  }

  getAgenda() {
    this._asociacionService.getAgenda().subscribe(
      (response) => {
        this.eventos = response.data;
        this.separetedEventes();
      },
      (error) => {
        console.log('error :>> ', error);
        this.loading = false;
      }
    );
  }

  separetedEventes() 
  {
    //1. Filtrar por los eventos que estén activos
    this.eventos = this.eventos.filter((e) => e.activo);

    //2. Crear objetos de tipo 'AgendaModel'
    for (let i = 0; i < this.eventos.length; i++) {
      // Extraer mes y anio
      const mes = +this.eventos[i].fechaInicio.split('-')[1];
      const anio = +this.eventos[i].fechaInicio.split('-')[0];

      // Comprobar si this.agenda esta vacia
      if (this.agenda.length === 0)
      {
        // Si this.agenda esta vacia insertar el mes con el evento
        // * Utilizar mes y anio como id unico
        const newEvento = {
          idMes: +`${mes}${anio}`,
          mes: this.setName(mes),
          anio: anio,
          evento: [this.eventos[i]],
        };
        this.agenda.push(newEvento);
      }
      else 
      {
        // Buscar si ya existe el mes y anio del objeto actual
        const yaExisteIndex = this.agenda.findIndex(
          (a) => a.idMes === +`${mes}${anio}`
        );
        if (yaExisteIndex >= 0) 
        {
          // Si this.agenda no esta vacia y ya existe el mes y anio, simplemente insertar en su arreglo eventos
          this.agenda[yaExisteIndex].evento.push(this.eventos[i]);
        }
        else
        {
          // Si this.agenda no esta vacia y no existe el mes y anio, insertar el mes y anio con el evento
          // * Utilizar mes y anio como id unico
          const newEvento = {
            idMes: +`${mes}${anio}`,
            mes: this.setName(mes),
            anio: anio,
            evento: [this.eventos[i]],
          };
          this.agenda.push(newEvento);
        }
      }
    }

    //3. Encontrar los años y guardarlos en el arreglo 'AgendaTemporal'
    for (let item of this.eventos)
    {
      const datosByYear = new AgendaTemporalModel();
      const yaExisteAnio = this.agendaTemporal.findIndex(
        (result) => result.anio == new Date(item.fechaInicio).getFullYear()
      );

      if(yaExisteAnio == -1)
      {
        datosByYear.anio = new Date(item.fechaInicio).getFullYear();
        this.agendaTemporal.push(datosByYear);
      }
    }

    //4. Filtrar los elementos por año
    for (let item of this.agendaTemporal)
    {
      //Filtramos los eventos que coincidan con el año que se está recorriendo
      let foundEventosPorAnio = this.agenda.filter(result => result.anio == item.anio);

      //Asignamos los meses que coincidan con el año que se está recorriendo
      item.eventos = foundEventosPorAnio;

      // Ordenar por mes
      const sortByMonth = (periodo: AgendaModel[]) =>
      periodo.sort((mesA: AgendaModel, mesB: AgendaModel) => {
        if (mesA.idMes < mesB.idMes) return 1;
        return 0;
      });

      sortByMonth(item.eventos);
    }

    //5. Ordenar por anio
    const sortByYear = (periodo: AgendaTemporalModel[]) =>
    periodo.sort((mesA: AgendaTemporalModel, mesB: AgendaTemporalModel) => {
      if (mesA.anio < mesB.anio) return 1;
      if (mesA.anio > mesB.anio) return -1;
      return 0;
    });

    this.agendaTemporal = sortByYear(this.agendaTemporal);

    this.loading = false;
  }

  separetedEventes2() {
    // Filtrar por los eventos que estén activos
    this.eventos = this.eventos.filter((e) => e.activo);

    for (let i = 0; i < this.eventos.length; i++) {
      // Extraer mes y anio
      const mes = +this.eventos[i].fechaInicio.split('-')[1];
      const anio = +this.eventos[i].fechaInicio.split('-')[0];

      // Comprobar si this.agenda esta vacia
      if (this.agenda.length === 0) {
        // Si this.agenda esta vacia insertar el mes con el evento
        // * Utilizar mes y anio como id unico
        const newEvento = {
          idMes: +`${mes}${anio}`,
          mes: this.setName(mes),
          anio: anio,
          evento: [this.eventos[i]],
        };
        this.agenda.push(newEvento);
      } else {
        // Buscar si ya existe el mes y anio del objeto actual
        const yaExisteIndex = this.agenda.findIndex(
          (a) => a.idMes === +`${mes}${anio}`
        );
        if (yaExisteIndex >= 0) {
          // Si this.agenda no esta vacia y ya existe el mes y anio, simplemente insertar en su arreglo eventos
          this.agenda[yaExisteIndex].evento.push(this.eventos[i]);
        } else {
          // Si this.agenda no esta vacia y no existe el mes y anio, insertar el mes y anio con el evento
          // * Utilizar mes y anio como id unico
          const newEvento = {
            idMes: +`${mes}${anio}`,
            mes: this.setName(mes),
            anio: anio,
            evento: [this.eventos[i]],
          };
          this.agenda.push(newEvento);
        }
      }

      // Ordenar por anio
      const sortByYear = (periodo: AgendaModel[]) =>
        periodo.sort((mesA: AgendaModel, mesB: AgendaModel) => {
          if (mesA.anio > mesB.anio) return 1;
          if (mesA.anio < mesB.anio) return -1;
          return 0;
        });

      // Ordenar por mes
      const sortByMonth = (periodo: AgendaModel[]) =>
        periodo.sort((mesA: AgendaModel, mesB: AgendaModel) => {
          if (mesA.idMes < mesB.idMes) return 1;
          return 0;
        });

      this.agenda = sortByYear(this.agenda);
      this.agenda = sortByMonth(this.agenda);
      this.loading = false;
    }
  }

  setName(idMes: number): string {
    if (idMes === 1) {
      return 'Enero';
    } else if (idMes === 2) {
      return 'Febrero';
    } else if (idMes === 3) {
      return 'Marzo';
    } else if (idMes === 4) {
      return 'Abril';
    } else if (idMes === 5) {
      return 'Mayo';
    } else if (idMes === 6) {
      return 'Junio';
    } else if (idMes === 7) {
      return 'Julio';
    } else if (idMes === 8) {
      return 'Agosto';
    } else if (idMes === 9) {
      return 'Septiembre';
    } else if (idMes === 10) {
      return 'Octubre';
    } else if (idMes === 11) {
      return 'Noviembre';
    } else if (idMes === 12) {
      return 'Diciembre';
    }
    return '';
  }
}
