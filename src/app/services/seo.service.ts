import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Global } from './global';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  private url = Global.url;

  updateTags(tag, partUrl, description?, image?) {
    if (tag == null && partUrl == null) {
      // homepage

      const title = 'Colegio de Arquitectos Tabasqueños | ArquiTab';

      this.updateTitle(title);
      this.updateUrl(this.url);
    } else {
      const endTitle = ' | ArquiTab';
      const pageTitle = tag + endTitle;

      this.updateTitle(pageTitle);
      this.updateUrl(this.url + '/' + partUrl);
    }

    if (description == null) {
      const desc = 'Somos un gremio de profesionistas de alta especialidad.';
      this.updateDescription(desc);
    } else {
      this.updateDescription(description);
    }

    if (image == null) {
      const img =
        'http://api.arquitab.org.mx/Content/img/slides//6.jpeg?t=44297.7724422068';
      this.updateImage(img);
    } else {
      this.updateImage(image);
    }
  }

  private updateTitle(title) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({
      name: 'title',
      property: 'og:title',
      content: title,
    });
  }

  private updateUrl(url) {
    this.meta.updateTag({ name: 'og:url', content: url });
    this.meta.updateTag({ property: 'twitter:url', content: url });
  }

  private updateDescription(description) {
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'twitter:description',
      content: description,
    });
    this.meta.updateTag({
      name: 'description',
      property: 'og:description',
      content: description,
    });
  }

  private updateImage(image) {
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'twitter:image', content: image });
    this.meta.updateTag({
      name: 'image',
      property: 'og:image',
      content: image,
    });
  }

  // updateTitle(title: string) {
  //   this.title.setTitle(title);
  // }

  // updateMetaTags(metaTags: MetaDefinition[]) {
  //   metaTags.forEach((m) => this.meta.updateTag(m));
  // }
}
