export class ProyectoModel {
  public idProyecto: number;
  public idSocio: number;
  public idUsuario: number;
  public idCategoria: number;
  public categoria: string;
  public mostrarEnNoticias: boolean;
  public titulo: string;
  public descripcion: string;
  public arquitectos: string;
  public tags: string;
  public anio: number;
  public area: number;
  public curado: string;
  public fotografias: string;
  public equipoDeDisenio: string;
  public proveedores: string;
  public clientes: string;
  public ingenieria: string;
  public paisajismo: string;
  public consultores: string;
  public constructora: string;
  public colaboradores: string;
  public ciudad: string;
  public pais: string;
  public ubicacion: string;
  public fechaPublicacion: string;
  public fechaActualizacion: string;
  public fotos?: FotoProyectoModel[];

  constructor() {}
}

export class FotoProyectoModel {
  public idFotografia: number;
  public idProyecto: number;
  public foto: string;
  public tags: string;

  constructor() {}
}
