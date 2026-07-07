import { Directive, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { KitapDurumu } from '../../features/books/models/book.model';

@Directive({
  selector: '[appDurumRozeti]',
  standalone: true
})
export class DurumRozetiDirective implements OnInit, OnChanges {
  @Input('appDurumRozeti') durum!: KitapDurumu;

  private renkler: Record<KitapDurumu, { arkaPlan: string; yazi: string }> = {
    okunacak: { arkaPlan: '#e5e7eb', yazi: '#374151' },
    okunuyor: { arkaPlan: '#fef3c7', yazi: '#92400e' },
    okundu: { arkaPlan: '#d1fae5', yazi: '#065f46' }
  };

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.rozetiUygula();
  }

  ngOnChanges(): void {
    this.rozetiUygula();
  }

  private rozetiUygula(): void {
    const renk = this.renkler[this.durum];
    if (!renk) return;

    const element = this.el.nativeElement;
    element.style.backgroundColor = renk.arkaPlan;
    element.style.color = renk.yazi;
    element.style.padding = '4px 10px';
    element.style.borderRadius = '12px';
    element.style.fontSize = '13px';
    element.style.fontWeight = '600';
    element.style.display = 'inline-block';
  }
}