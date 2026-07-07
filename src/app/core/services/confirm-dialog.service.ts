import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogVerileri {
  baslik?: string;
  mesaj?: string;
  onayMetni?: string;
  iptalMetni?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  acikMi = signal(false);
  baslik = signal('Emin misiniz?');
  mesaj = signal('Bu işlem geri alınamaz.');
  onayMetni = signal('Evet, Sil');
  iptalMetni = signal('Vazgeç');

  private cozumleyici: ((sonuc: boolean) => void) | null = null;

  confirm(veriler?: ConfirmDialogVerileri): Promise<boolean> {
    this.baslik.set(veriler?.baslik ?? 'Emin misiniz?');
    this.mesaj.set(veriler?.mesaj ?? 'Bu işlem geri alınamaz.');
    this.onayMetni.set(veriler?.onayMetni ?? 'Evet, Sil');
    this.iptalMetni.set(veriler?.iptalMetni ?? 'Vazgeç');
    this.acikMi.set(true);

    return new Promise<boolean>((resolve) => {
      this.cozumleyici = resolve;
    });
  }

  onayla(): void {
    this.acikMi.set(false);
    this.cozumleyici?.(true);
    this.cozumleyici = null;
  }

  iptalEt(): void {
    this.acikMi.set(false);
    this.cozumleyici?.(false);
    this.cozumleyici = null;
  }
}