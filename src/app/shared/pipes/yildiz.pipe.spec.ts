import { YildizPipe } from './yildiz.pipe';

describe('YildizPipe', () => {
  let pipe: YildizPipe;

  beforeEach(() => {
    pipe = new YildizPipe();
  });

  it('bir pipe instance olusturulmali', () => {
    expect(pipe).toBeTruthy();
  });

  it('puan 5 ise 5 dolu yildiz gostermeli', () => {
    const sonuc = pipe.transform(5);
    expect(sonuc).toBe('★★★★★');
  });

  it('puan 0 ise 5 bos yildiz gostermeli', () => {
    const sonuc = pipe.transform(0);
    expect(sonuc).toBe('☆☆☆☆☆');
  });

  it('puan 3 ise 3 dolu 2 bos yildiz gostermeli', () => {
    const sonuc = pipe.transform(3);
    expect(sonuc).toBe('★★★☆☆');
  });

  it('null verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform(null);
    expect(sonuc).toBe('');
  });

  it('undefined verildiginde bos string dondurmeli', () => {
    const sonuc = pipe.transform(undefined);
    expect(sonuc).toBe('');
  });

  it('kusurat iceren bir puani yuvarlamali (2.6 -> 3)', () => {
    const sonuc = pipe.transform(2.6);
    expect(sonuc).toBe('★★★☆☆');
  });

  it('5ten buyuk bir puan verilirse 5 dolu yildizda sinirlamali', () => {
    const sonuc = pipe.transform(8);
    expect(sonuc).toBe('★★★★★');
  });

  it('negatif bir puan verilirse 0 dolu yildizda sinirlamali', () => {
    const sonuc = pipe.transform(-2);
    expect(sonuc).toBe('☆☆☆☆☆');
  });
});