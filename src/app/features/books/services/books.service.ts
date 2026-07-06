import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from '../../../core/services/storage.service';
import { Book } from '../models/book.model';

const STORAGE_KEY = 'kitaplik-books';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private booksSubject = new BehaviorSubject<Book[]>([]);

  /**
   * Component'lerin abone olacagi (subscribe) gozlemlenebilir kitap listesi.
   */
  books$: Observable<Book[]> = this.booksSubject.asObservable();

  constructor(private storageService: StorageService) {
    const kayitliKitaplar = this.storageService.getItem<Book[]>(STORAGE_KEY, []);
    this.booksSubject.next(kayitliKitaplar);
  }

  /**
   * Yeni bir kitap ekler. id otomatik olarak uretilir.
   */
  addBook(yeniKitap: Omit<Book, 'id' | 'eklenmeTarihi'>): void {
    const mevcutKitaplar = this.booksSubject.value;
    const yeniId = mevcutKitaplar.length > 0
      ? Math.max(...mevcutKitaplar.map(k => k.id)) + 1
      : 1;

    const kitap: Book = {
      ...yeniKitap,
      id: yeniId,
      eklenmeTarihi: new Date().toISOString()
    };

    const guncelListe = [...mevcutKitaplar, kitap];
    this.kaydetVeYayinla(guncelListe);
  }

  /**
   * Mevcut bir kitabi gunceller.
   */
  updateBook(id: number, guncellenenAlanlar: Partial<Book>): void {
    const guncelListe = this.booksSubject.value.map(kitap =>
      kitap.id === id ? { ...kitap, ...guncellenenAlanlar } : kitap
    );
    this.kaydetVeYayinla(guncelListe);
  }

  /**
   * Bir kitabi id'sine gore siler.
   */
  deleteBook(id: number): void {
    const guncelListe = this.booksSubject.value.filter(kitap => kitap.id !== id);
    this.kaydetVeYayinla(guncelListe);
  }

  /**
   * id'sine gore tek bir kitabi doner (form sayfasinda duzenleme icin kullanilir).
   */
  getBookById(id: number): Book | undefined {
    return this.booksSubject.value.find(kitap => kitap.id === id);
  }

  /**
   * Listeyi hem localStorage'a kaydeder hem de abonelere yeni veriyi yayinlar.
   */
  private kaydetVeYayinla(guncelListe: Book[]): void {
    this.storageService.setItem(STORAGE_KEY, guncelListe);
    this.booksSubject.next(guncelListe);
  }
}