import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yildiz',
  standalone: true
})
export class YildizPipe implements PipeTransform {
  transform(puan: number | null | undefined): string {
    if (puan === null || puan === undefined) return '';

    const doluYildizSayisi = Math.max(0, Math.min(5, Math.round(puan)));
    const bosYildizSayisi = 5 - doluYildizSayisi;

    return '★'.repeat(doluYildizSayisi) + '☆'.repeat(bosYildizSayisi);
  }
}