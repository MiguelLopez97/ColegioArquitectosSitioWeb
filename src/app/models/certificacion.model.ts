export class CertificacionModel {
  public idSocio: number;
  public idCertificacion: number;
  public descripcion: string;
  public folio: string;
  public fechaConstancia: Date;
  public vigenteHasta: Date;
  public vigenteDesde: Date;
  public archivo: string;
  public archivoUri: string;

  constructor() {}
}
