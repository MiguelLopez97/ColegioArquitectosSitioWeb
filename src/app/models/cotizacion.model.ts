export class CotizacionModel {
  public idCotizacion: number;
  public idSocio: number;
  public idUsoObra: number;
  public idFactor: number;
  public idEstatus: number;
  public estatus: string;
  public metros2: number;
  public usoDeObra: string;
  public factorCalidad: string;
  public superficie: number;
  public smv: number;
  public salarioMinimoVigente: number;
  public valorFactor: number;
  public arancelTotal: number;
  public folio: string;
  public obra: string;
  public propietario: string;
  public ubicacion: string;
  public fechaCreacion: string;
  public fechaAprobacion: string;
  public version: number;
  public detalle: DetalleCotizacionModel[] | CorresponsalArancelModel[];

  constructor() {}
}

export class DetalleCotizacionModel {
  public idCotizacionDetalle: number;
  public idCotizacion: number;
  public idCorresponsal: number;
  public corresponsal: string;
  public porcentajeArancel: number;
  public porcentajeReal: number;
  public montoReal: number;
  public montoArancel: number;
}

export class CorresponsalArancelModel {
  public idCorresponsal: number;
  public corresponsal: string;
  public porcentaje: number;
  public arancel: number;
}
