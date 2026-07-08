import { TurkceTarihPipe } from './turkce-tarih.pipe';

describe('TurkceTarihPipe', () => {
  let pipe: TurkceTarihPipe;

  beforeEach(() => {
    pipe = new TurkceTarihPipe();
  });

  it('bir pipe instance olusturulmali', () => {
    expect(pipe).toBeTruthy();
  });

  it('gecerli bir ISO tarihini Turkce formata cevirmeli', () => {
    const sonuc = pipe.transform('2026-07-08');
    expect(sonuc).toBe('8 Temmuz 2026');
  });

  it('bos string verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform('');
    expect(sonuc).toBe('');
  });

  it('null verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform(null);
    expect(sonuc).toBe('');
  });

  it('undefined verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform(undefined);
    expect(sonuc).toBe('');
  });

  it('gecersiz bir tarih string\'i verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform('gecersiz-tarih');
    expect(sonuc).toBe('');
  });

  it('yilin farkli bir ayini dogru cevirmeli', () => {
    const sonuc = pipe.transform('2025-12-25');
    expect(sonuc).toBe('25 Aralık 2025');
  });
});