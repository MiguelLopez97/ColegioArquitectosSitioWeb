export class SharedResource {
  public resource: ResourceType;
  public idResource: number;
  public title: string;
  public url: string;
  public description: string;
  public imgUri: string;
}

export type ResourceType = 'noticia' | 'agenda' | 'proyecto';
