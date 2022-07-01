export class SocioOrganigramaModel {
  public idOrganigrama: number;
  public idSocio: number;
  public avatarUri: string;
  public nombre: string;
  public aPaterno: string;
  public aMaterno: string;
  public puesto: string;
  public nivel: number;

  constructor() {}
}

export class NivelesModel {
  public nivel: number;
  public socios: SocioOrganigramaModel[];
}
