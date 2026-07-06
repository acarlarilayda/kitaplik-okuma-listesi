export type KitapDurumu = 'okunacak' | 'okunuyor' | 'okundu';

export interface Book {
  id: number;
  ad: string;
  yazar: string;
  tur?: string;
  durum: KitapDurumu;
  sayfaSayisi?: number;
  puan?: number;
  not?: string;
  eklenmeTarihi: string; // ISO tarih formatında
}