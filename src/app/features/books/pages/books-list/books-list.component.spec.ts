import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BooksListComponent } from './books-list.component';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let booksServiceMock: any;
  let routerMock: any;
  let booksSubject: Subject<Book[]>;

  const ornekKitaplar: Book[] = [
    { id: 1, ad: 'Suç ve Ceza', yazar: 'Dostoyevski', tur: 'Roman', durum: 'okundu', puan: 5, eklenmeTarihi: '2026-01-01' },
    { id: 2, ad: 'Dune', yazar: 'Frank Herbert', tur: 'Bilim Kurgu', durum: 'okunacak', puan: 4, eklenmeTarihi: '2026-02-01' }
  ];

  beforeEach(() => {
    booksSubject = new Subject<Book[]>();
    booksServiceMock = {
      books$: booksSubject.asObservable(),
      deleteBook: jasmine.createSpy('deleteBook')
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [BooksListComponent],
      providers: [
        { provide: BooksService, useValue: booksServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    const fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    booksSubject.next(ornekKitaplar);
  });

  it('bir component olusturulmali', () => {
    expect(component).toBeTruthy();
  });

  it('servisten gelen kitaplari books signaline yazmali', () => {
    expect(component.books()).toEqual(ornekKitaplar);
  });

  it('yukleme tamamlaninca isLoading false olmali', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('istatistikleri dogru hesaplamali', () => {
    const stats = component.stats();
    expect(stats.toplam).toBe(2);
    expect(stats.okundu).toBe(1);
    expect(stats.okunacak).toBe(1);
    expect(stats.okunuyor).toBe(0);
  });

  it('arama terimine gore kitaplari filtrelemeli', () => {
    component.onSearchChange('dune');
    expect(component.filteredBooks().length).toBe(1);
    expect(component.filteredBooks()[0].ad).toBe('Dune');
  });

  it('arama terimi bossa tum kitaplari gostermeli', () => {
    component.onSearchChange('');
    expect(component.filteredBooks().length).toBe(2);
  });

  it('goToAddBook cagrildiginda dogru rotaya yonlendirmeli', () => {
    component.goToAddBook();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/kitaplar/ekle']);
  });

  it('onEdit cagrildiginda dogru rotaya yonlendirmeli', () => {
    component.onEdit(ornekKitaplar[0]);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/kitaplar', 1, 'duzenle']);
  });

  it('onDeleteRequest cagrildiginda deleteTargetId ayarlanmali', () => {
    component.onDeleteRequest(ornekKitaplar[0]);
    expect(component.deleteTargetId()).toBe(1);
  });

  it('onDeleteConfirm cagrildiginda booksService.deleteBook cagrilmali', () => {
    component.onDeleteRequest(ornekKitaplar[0]);
    component.onDeleteConfirm();
    expect(booksServiceMock.deleteBook).toHaveBeenCalledWith(1);
    expect(component.deleteTargetId()).toBeNull();
  });

  it('onDeleteCancel cagrildiginda deleteTargetId sifirlanmali', () => {
    component.onDeleteRequest(ornekKitaplar[0]);
    component.onDeleteCancel();
    expect(component.deleteTargetId()).toBeNull();
  });
});