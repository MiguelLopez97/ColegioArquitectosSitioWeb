export class CursoModel {
  public idCurso: number;
  public idInstructor1: number;
  public idInstructor2: number;
  public idProducto: number;
  public descripcion: string;
  public sede: string;
  public fechaInicio: string;
  public fechaFin: string;
  public horaInicio: string;
  public horaFin: string;
  public instructor1: InstructorModel;
  public instructor2: InstructorModel;
  public dias: number;
  public participantes: ParticipanteCurso[];
  public especialidades: any;

  constructor() { }
}

export class CursoTemporalModel {
  public idMes: number;
  public mes: string;
  public anio: number;
  public cursosPorMes?: CursoModel[];

  constructor() {}
}

export class InstructorModel {
  public nombre: string;
  public aPaterno: string;
  public aMaterno: string;
  public tratamiento: string;
  public fechaNacimiento: string;
  public curp: string;
  public rfc: string;
  public curriculumVitae: string;
  public genero: string;
  public correoElectronico: string;
  public telefono1: string;
  public telefono2: string;

  constructor() { }
}

export class ParticipanteCurso {
  public idCursoParticipante: number;
  public idCurso: number;
  public idSocio: number;
  public pagado: boolean;
  public participante: string;
  public fechaRegistro: string;
  public fechaConstancia: string;
  public folioConstancia: string;

  constructor() { }
}