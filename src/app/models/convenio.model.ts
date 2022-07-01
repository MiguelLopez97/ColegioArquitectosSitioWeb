export class ConvenioModel {
  public idConvenio: number;
  public idTipoConvenio: number;
  public tipoConvenio?: string;
  public entidad: string;
  public descripcion: string;
  public logo?: string;
  public beneficio: string;
  public representante: string;
  public contacto: string;
  public correoElectronico: string;
  public telefono: string;
  public whatsApp: string;
  public facebook: string;
  public twitter: string;
  public instagram: string;
  public paginaWeb: string;
  public vigencia: string;

  constructor() {}
}

export class LogoConvenio {
  public idConvenio: number;
  public fileContentBase64: string;
  public fileName: string;
  public fileExt: string;
  public fileArray?: string;
  public progreso?: number;
  public fileSize?: number;
}

export class FotoConvenio {
  public idConvenio: number;
  public fileContentBase64: string;
  public fileName: string;
  public fileExt: string;
  public fileSize?: number;
  public file?: string;
  public fileArray?: string;
  public extensionValid?: string;
  public fileMaxSize?: number;
  public progreso?: number;
}
