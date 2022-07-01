import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHTML',
  pure: true,
})
export class SafeHTMLPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(v: string): SafeHtml {
    var before = v.substring(0, v.indexOf('&lt;'));
    var after = v.substring(v.lastIndexOf('&gt;') + 4);
    var mySubString = v.substring(v.indexOf('&lt;'), v.lastIndexOf('&gt;') + 4);
    const doc = new DOMParser().parseFromString(mySubString, 'text/html');

    const whole = `${before}${doc.documentElement.textContent}${after}`;
    // return this._sanitizer.bypassSecurityTrustHtml(doc.documentElement.textContent);
    return this._sanitizer.bypassSecurityTrustHtml(whole);
  }
}
