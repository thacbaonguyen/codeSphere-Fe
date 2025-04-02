import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    marked.setOptions({
      gfm: true,
      breaks: true
    });
  }

  transform(value: string | undefined): SafeHtml {
    if (!value) return this.sanitizer.bypassSecurityTrustHtml('');
    const htmlContent = marked(value);
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
