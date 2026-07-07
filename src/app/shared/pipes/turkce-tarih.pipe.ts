import { Pipe, PipeTransform } from '@angular/core';

const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

@Pipe({
  name: 'turkceTarih',
  standalone: true
})
export class TurkceTarihPipe implements PipeTransform {
  transform(isoTarih: string | null | undefined): string {
    if (!isoTarih) return '';

    const tarih = new Date(isoTarih);
    if (isNaN(tarih.getTime())) return '';

    const gun = tarih.getDate();
    const ay = AYLAR[tarih.getMonth()];
    const yil = tarih.getFullYear();

    return `${gun} ${ay} ${yil}`;
  }
}