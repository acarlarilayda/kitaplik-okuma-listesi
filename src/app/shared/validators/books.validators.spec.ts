import { FormControl } from '@angular/forms';
import { positiveIntegerValidator, ratingRangeValidator } from './books.validators';

describe('positiveIntegerValidator', () => {
  const validator = positiveIntegerValidator();

  it('deger null ise hata vermemeli', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('deger undefined ise hata vermemeli', () => {
    const control = new FormControl(undefined);
    expect(validator(control)).toBeNull();
  });

  it('deger bos string ise hata vermemeli', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('pozitif bir tam sayi ise hata vermemeli', () => {
    const control = new FormControl(250);
    expect(validator(control)).toBeNull();
  });

  it('string olarak verilen pozitif tam sayi hata vermemeli', () => {
    const control = new FormControl('10');
    expect(validator(control)).toBeNull();
  });

  it('sifir ise hata vermeli', () => {
    const control = new FormControl(0);
    expect(validator(control)).toEqual({ positiveInteger: true });
  });

  it('negatif bir sayi ise hata vermeli', () => {
    const control = new FormControl(-5);
    expect(validator(control)).toEqual({ positiveInteger: true });
  });

  it('ondalikli bir sayi ise hata vermeli', () => {
    const control = new FormControl(3.5);
    expect(validator(control)).toEqual({ positiveInteger: true });
  });

  it('sayisal olmayan bir deger ise hata vermeli', () => {
    const control = new FormControl('abc');
    expect(validator(control)).toEqual({ positiveInteger: true });
  });
});

describe('ratingRangeValidator', () => {
  const validator = ratingRangeValidator();

  it('deger null ise hata vermemeli', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('deger undefined ise hata vermemeli', () => {
    const control = new FormControl(undefined);
    expect(validator(control)).toBeNull();
  });

  it('deger bos string ise hata vermemeli', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('1 ile 5 arasinda bir deger hata vermemeli', () => {
    const control = new FormControl(3);
    expect(validator(control)).toBeNull();
  });

  it('sinir degeri 1 hata vermemeli', () => {
    const control = new FormControl(1);
    expect(validator(control)).toBeNull();
  });

  it('sinir degeri 5 hata vermemeli', () => {
    const control = new FormControl(5);
    expect(validator(control)).toBeNull();
  });

  it('1den kucuk bir deger hata vermeli', () => {
    const control = new FormControl(0);
    expect(validator(control)).toEqual({ ratingRange: true });
  });

  it('5ten buyuk bir deger hata vermeli', () => {
    const control = new FormControl(6);
    expect(validator(control)).toEqual({ ratingRange: true });
  });

  it('sayisal olmayan bir deger hata vermeli', () => {
    const control = new FormControl('abc');
    expect(validator(control)).toEqual({ ratingRange: true });
  });
});