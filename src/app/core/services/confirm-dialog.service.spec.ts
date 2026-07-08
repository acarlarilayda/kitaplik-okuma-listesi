import { TestBed } from '@angular/core/testing';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('bir servis olusturulmali', () => {
    expect(service).toBeTruthy();
  });

  it('baslangicta acikMi false olmali', () => {
    expect(service.acikMi()).toBe(false);
  });

  it('confirm cagrildiginda acikMi true olmali', () => {
    service.confirm();

    expect(service.acikMi()).toBe(true);
  });

  it('confirm parametresiz cagrilirsa varsayilan metinleri kullanmali', () => {
    service.confirm();

    expect(service.baslik()).toBe('Emin misiniz?');
    expect(service.mesaj()).toBe('Bu işlem geri alınamaz.');
    expect(service.onayMetni()).toBe('Evet, Sil');
    expect(service.iptalMetni()).toBe('Vazgeç');
  });

  it('confirm parametre ile cagrilirsa verilen metinleri kullanmali', () => {
    service.confirm({
      baslik: 'Kitabi Sil',
      mesaj: 'Bu kitap kalici olarak silinecek.',
      onayMetni: 'Sil',
      iptalMetni: 'Iptal'
    });

    expect(service.baslik()).toBe('Kitabi Sil');
    expect(service.mesaj()).toBe('Bu kitap kalici olarak silinecek.');
    expect(service.onayMetni()).toBe('Sil');
    expect(service.iptalMetni()).toBe('Iptal');
  });

  it('confirm bir Promise donmeli', () => {
    const sonuc = service.confirm();

    expect(sonuc instanceof Promise).toBe(true);
  });

  it('onayla cagrildiginda acikMi false olmali', () => {
    service.confirm();

    service.onayla();

    expect(service.acikMi()).toBe(false);
  });

  it('onayla cagrildiginda confirm promisi true ile sonuclanmali', async () => {
    const sonucPromise = service.confirm();

    service.onayla();

    const sonuc = await sonucPromise;
    expect(sonuc).toBe(true);
  });

  it('iptalEt cagrildiginda acikMi false olmali', () => {
    service.confirm();

    service.iptalEt();

    expect(service.acikMi()).toBe(false);
  });

  it('iptalEt cagrildiginda confirm promisi false ile sonuclanmali', async () => {
    const sonucPromise = service.confirm();

    service.iptalEt();

    const sonuc = await sonucPromise;
    expect(sonuc).toBe(false);
  });

  it('onayla, confirm hic cagrilmadan cagrilirsa hata firlatmamali', () => {
    expect(() => service.onayla()).not.toThrow();
  });

  it('iptalEt, confirm hic cagrilmadan cagrilirsa hata firlatmamali', () => {
    expect(() => service.iptalEt()).not.toThrow();
  });
});