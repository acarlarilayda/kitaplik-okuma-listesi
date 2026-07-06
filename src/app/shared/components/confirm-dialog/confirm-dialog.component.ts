import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() acikMi: boolean = false;
  @Input() baslik: string = 'Emin misiniz?';
  @Input() mesaj: string = 'Bu islem geri alinamaz.';
  @Input() onayMetni: string = 'Evet, Sil';
  @Input() iptalMetni: string = 'Vazgec';

  @Output() onaylandi = new EventEmitter<void>();
  @Output() iptalEdildi = new EventEmitter<void>();

  onOnayla(): void {
    this.onaylandi.emit();
  }

  onIptalEt(): void {
    this.iptalEdildi.emit();
  }
}