import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('bir servis olusturulmali', () => {
    expect(service).toBeTruthy();
  });

  it('getItem, key localStoragede yoksa varsayilan degeri donmeli', () => {
    const sonuc = service.getItem('olmayan-key', 'varsayilan');

    expect(sonuc).toBe('varsayilan');
  });

  it('getItem, localStoragede kayitli veriyi JSON olarak parse edip donmeli', () => {
    const veri = { ad: 'Suç ve Ceza', puan: 5 };
    localStorage.setItem('kitap', JSON.stringify(veri));

    const sonuc = service.getItem<typeof veri>('kitap', { ad: '', puan: 0 });

    expect(sonuc).toEqual(veri);
  });

  it('getItem, bozuk JSON verildiginde varsayilan degeri donmeli', () => {
    localStorage.setItem('bozuk-veri', 'gecersiz-json{{{');

    const sonuc = service.getItem('bozuk-veri', 'varsayilan');

    expect(sonuc).toBe('varsayilan');
  });

  it('getItem, bozuk JSON durumunda console.error cagirmali', () => {
    spyOn(console, 'error');
    localStorage.setItem('bozuk-veri', 'gecersiz-json{{{');

    service.getItem('bozuk-veri', 'varsayilan');

    expect(console.error).toHaveBeenCalled();
  });

  it('setItem, veriyi JSON string olarak localStoragea yazmali', () => {
    const veri = { ad: 'Dune', puan: 4 };

    service.setItem('kitap', veri);

    expect(JSON.parse(localStorage.getItem('kitap')!)).toEqual(veri);
  });

  it('setItem, localStorage hata firlatirsa yakalamali ve disariya hata firlatmamali', () => {
    spyOn(console, 'error');
    spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');

    expect(() => service.setItem('kitap', { ad: 'Dune' })).not.toThrow();
  });

  it('setItem, localStorage hata firlatirsa console.error cagirmali', () => {
    spyOn(console, 'error');
    spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');

    service.setItem('kitap', { ad: 'Dune' });

    expect(console.error).toHaveBeenCalled();
  });

  it('removeItem, belirtilen anahtari localStoragedan silmeli', () => {
    localStorage.setItem('silinecek-key', 'deger');

    service.removeItem('silinecek-key');

    expect(localStorage.getItem('silinecek-key')).toBeNull();
  });

  it('removeItem, olmayan bir key icin hata firlatmamali', () => {
    expect(() => service.removeItem('olmayan-key')).not.toThrow();
  });
});