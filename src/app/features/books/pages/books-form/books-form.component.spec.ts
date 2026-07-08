import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksFormComponent } from './books-form.component';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

describe('BooksFormComponent', () => {
  let component: BooksFormComponent;
  let booksServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const ornekKitap: Book = {
    id: 1,
    ad: 'Suç ve Ceza',
    yazar: 'Dostoyevski',
    tur: 'Roman',
    durum: 'okundu',
    puan: 5,
    eklenmeTarihi: '2026-01-01'
  };

  beforeEach(() => {
    booksServiceMock = {
      getBookById: jasmine.createSpy('getBookById').and.returnValue(undefined),
      addBook: jasmine.createSpy('addBook'),
      updateBook: jasmine.createSpy('updateBook')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [BooksFormComponent],
      providers: [
        { provide: BooksService, useValue: booksServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    });

    const fixture = TestBed.createComponent(BooksFormComponent);
    component = fixture.componentInstance;
  });

  it('bir component olusturulmali', () => {
    expect(component).toBeTruthy();
  });

  it('baslangicta form gecersiz olmali (ad ve yazar zorunlu)', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('id parametresi yoksa ekleme modunda kalmali', () => {
    component.ngOnInit();

    expect(component.isEditMode()).toBe(false);
    expect(booksServiceMock.getBookById).not.toHaveBeenCalled();
  });

  it('id parametresi var ve kitap bulunursa duzenleme moduna gecmeli', () => {
    activatedRouteMock.snapshot.paramMap.get.and.returnValue('1');
    booksServiceMock.getBookById.and.returnValue(ornekKitap);

    component.ngOnInit();

    expect(booksServiceMock.getBookById).toHaveBeenCalledWith(1);
    expect(component.isEditMode()).toBe(true);
  });

  it('duzenleme modunda form, mevcut kitap bilgileriyle doldurulmali', () => {
    activatedRouteMock.snapshot.paramMap.get.and.returnValue('1');
    booksServiceMock.getBookById.and.returnValue(ornekKitap);

    component.ngOnInit();

    expect(component.form.get('ad')?.value).toBe('Suç ve Ceza');
    expect(component.form.get('yazar')?.value).toBe('Dostoyevski');
    expect(component.form.get('durum')?.value).toBe('okundu');
    expect(component.form.get('puan')?.value).toBe(5);
  });

  it('id parametresi olup kitap bulunamazsa ekleme modunda kalmali', () => {
    activatedRouteMock.snapshot.paramMap.get.and.returnValue('99');
    booksServiceMock.getBookById.and.returnValue(undefined);

    component.ngOnInit();

    expect(component.isEditMode()).toBe(false);
  });

  it('form gecersizken onSubmit cagrilirsa tum alanlar dokunulmus olarak isaretlenmeli', () => {
    spyOn(component.form, 'markAllAsTouched');

    component.onSubmit();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('form gecersizken onSubmit cagrilirsa booksService metotlari cagrilmamali', () => {
    component.onSubmit();

    expect(booksServiceMock.addBook).not.toHaveBeenCalled();
    expect(booksServiceMock.updateBook).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('ekleme modunda form gecerliyse booksService.addBook cagrilmali', () => {
    component.ngOnInit();
    component.form.patchValue({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar' });

    component.onSubmit();

    expect(booksServiceMock.addBook).toHaveBeenCalledWith(component.form.value);
    expect(booksServiceMock.updateBook).not.toHaveBeenCalled();
  });

  it('ekleme modunda basarili submit sonrasi kitaplar sayfasina yonlendirmeli', () => {
    component.ngOnInit();
    component.form.patchValue({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar' });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/kitaplar']);
  });

  it('duzenleme modunda form gecerliyse booksService.updateBook dogru id ile cagrilmali', () => {
    activatedRouteMock.snapshot.paramMap.get.and.returnValue('1');
    booksServiceMock.getBookById.and.returnValue(ornekKitap);
    component.ngOnInit();

    component.form.patchValue({ ad: 'Guncellenmis Ad' });
    component.onSubmit();

    expect(booksServiceMock.updateBook).toHaveBeenCalledWith(1, component.form.value);
    expect(booksServiceMock.addBook).not.toHaveBeenCalled();
  });

  it('basarili submit sonrasinda form pristine hale gelmeli', () => {
    component.ngOnInit();
    component.form.patchValue({ ad: 'Yeni Kitap', yazar: 'Yeni Yazar' });
    component.form.markAsDirty();

    component.onSubmit();

    expect(component.form.pristine).toBe(true);
  });

  it('onCancel cagrildiginda kitaplar sayfasina yonlendirmeli', () => {
    component.onCancel();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/kitaplar']);
  });

  it('formDegistiMi, form kirlenmemisse false donmeli', () => {
    expect(component.formDegistiMi()).toBe(false);
  });

  it('formDegistiMi, form kirlenmisse true donmeli', () => {
    component.form.markAsDirty();

    expect(component.formDegistiMi()).toBe(true);
  });
});