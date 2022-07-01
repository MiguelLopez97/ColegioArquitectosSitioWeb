export class EventoModel {
  public idAgenda: number;
  public idTipo: number;
  public idProducto: number;
  public descripcion: string;
  public organizador: string;
  public contacto: string;
  public telefono: string;
  public correo: string;
  public horario: string;
  public costoSocio: number;
  public costoEstudiante: number;
  public costoPublico: number;
  public fechaInicio: string;
  public fechaFin: string;
  public flyer: string;
  public activo: boolean;

  constructor() {}
}

export class AgendaModel {
  public idMes: number;
  public mes: string;
  public anio: number;
  public evento?: EventoModel[];

  constructor() {}
}

export class AgendaTemporalModel {
  public anio: number;
  public eventos: AgendaModel[];
}
