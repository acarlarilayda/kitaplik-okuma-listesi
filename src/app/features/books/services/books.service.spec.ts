import { TestBed } from '@angular/core/testing';
import { BooksService } from './books.service';
import { StorageService } from '../../../core/services/storage.service';
import { Book } from '../models/book.model';

describe('BooksService', () => {
  let service: BooksService;
  let storageServiceMock: any;

  const ornekKitaplar: Book[] = [
    { id: 1, ad: 'Suç ve Ceza', yazar: 'Dostoyevski', tur: 'Roman', durum: 'okundu', puan: 5, eklenmeTarihi: '2026-01-01' },
    { id: 2, ad: 'Dune', yazar: 'Frank Herbert', tur: 'Bilim Kurgu', durum: 'okunacak', puan: 4, eklenmeTarihi: '2026-02-01' }
  ];

  beforeEach(() => {
    storageServiceMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue([]),
      setItem: jasmine.createSpy('setItem')
    };

    TestBed.configureTestingModule({
      providers: [
        BooksService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });
  });

  it('bir servis olusturulmali', () => {
    service = TestBed.inject(BooksService);
    expect(service).toBeTruthy();
  });

  it('olusturuldugunda storageServiceden kayitli kitaplari okumali', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);

    service = TestBed.inject(BooksService);

    expect(storageServiceMock.getItem).toHaveBeenCalledWith('kitaplik-books', []);
  });

  it('books$ baslangicta storagedeki kitaplari yayinlamali', (done) => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.books$.subscribe(books => {
      expect(books).toEqual(ornekKitaplar);
      done();
    });
  });

  it('storagede kayit yoksa books$ bos dizi yayinlamali', (done) => {
    storageServiceMock.getItem.and.returnValue([]);
    service = TestBed.inject(BooksService);

    service.books$.subscribe(books => {
      expect(books).toEqual([]);
      done();
    });
  });

  it('kitap listesi bossa addBook ilk kitaba id 1 vermeli', () => {
    storageServiceMock.getItem.and.returnValue([]);
    service = TestBed.inject(BooksService);

    service.addBook({ ad: 'Ilk Kitap', yazar: 'Yazar', tur: 'Roman', durum: 'okunacak' } as any);

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    expect(kaydedilenListe[0].id).toBe(1);
  });

  it('addBook cagrildiginda yeni kitaba otomatik artan id atanmali', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.addBook({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar', tur: 'Roman', durum: 'okunacak' } as any);

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    expect(kaydedilenListe[2].id).toBe(3);
  });

  it('addBook cagrildiginda eklenmeTarihi otomatik atanmali', () => {
    storageServiceMock.getItem.and.returnValue([]);
    service = TestBed.inject(BooksService);

    service.addBook({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar', tur: 'Roman', durum: 'okunacak' } as any);

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    expect(kaydedilenListe[0].eklenmeTarihi).toBeTruthy();
  });

  it('addBook cagrildiginda storageService.setItem dogru anahtar ile cagrilmali', () => {
    storageServiceMock.getItem.and.returnValue([]);
    service = TestBed.inject(BooksService);

    service.addBook({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar', tur: 'Roman', durum: 'okunacak' } as any);

    expect(storageServiceMock.setItem).toHaveBeenCalledWith('kitaplik-books', jasmine.any(Array));
  });

  it('addBook sonrasi books$ guncel listeyi yayinlamali', (done) => {
    storageServiceMock.getItem.and.returnValue([]);
    service = TestBed.inject(BooksService);

    service.addBook({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar', tur: 'Roman', durum: 'okunacak' } as any);

    service.books$.subscribe(books => {
      expect(books.length).toBe(1);
      expect(books[0].ad).toBe('Yeni Kitap');
      done();
    });
  });

  it('updateBook cagrildiginda ilgili kitabin alanlari guncellenmeli', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.updateBook(1, { durum: 'okunuyor' });

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    const guncellenenKitap = kaydedilenListe.find((k: Book) => k.id === 1);
    expect(guncellenenKitap.durum).toBe('okunuyor');
  });

  it('updateBook diger kitaplari degistirmemeli', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.updateBook(1, { durum: 'okunuyor' });

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    const digerKitap = kaydedilenListe.find((k: Book) => k.id === 2);
    expect(digerKitap).toEqual(ornekKitaplar[1]);
  });

  it('olmayan bir id ile updateBook cagrilirsa listeyi degistirmeden birakmali', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.updateBook(99, { durum: 'okunuyor' });

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    expect(kaydedilenListe).toEqual(ornekKitaplar);
  });

  it('deleteBook cagrildiginda ilgili kitap listeden cikarilmali', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.deleteBook(1);

    const kaydedilenListe = storageServiceMock.setItem.calls.mostRecent().args[1];
    expect(kaydedilenListe.length).toBe(1);
    expect(kaydedilenListe.find((k: Book) => k.id === 1)).toBeUndefined();
  });

  it('deleteBook sonrasi books$ guncel listeyi yayinlamali', (done) => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    service.deleteBook(2);

    service.books$.subscribe(books => {
      expect(books.length).toBe(1);
      expect(books[0].id).toBe(1);
      done();
    });
  });

  it('getBookById var olan bir id icin dogru kitabi donmeli', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    const kitap = service.getBookById(2);

    expect(kitap).toEqual(ornekKitaplar[1]);
  });

  it('getBookById olmayan bir id icin undefined donmeli', () => {
    storageServiceMock.getItem.and.returnValue(ornekKitaplar);
    service = TestBed.inject(BooksService);

    const kitap = service.getBookById(99);

    expect(kitap).toBeUndefined();
  });
});