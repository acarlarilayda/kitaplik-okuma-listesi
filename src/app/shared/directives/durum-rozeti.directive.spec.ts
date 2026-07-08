import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DurumRozetiDirective } from './durum-rozeti.directive';
import { KitapDurumu } from '../../features/books/models/book.model';

@Component({
  standalone: true,
  imports: [DurumRozetiDirective],
  template: `<span [appDurumRozeti]="durum">{{ durum }}</span>`
})
class TestHostComponent {
  durum: KitapDurumu = 'okunacak';
}

describe('DurumRozetiDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function elemaniAl(): HTMLElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('bir directive olusturulmali', () => {
    fixture.detectChanges();
    expect(elemaniAl()).toBeTruthy();
  });

  it(`durum 'okunacak' iken gri renkleri uygulamali`, () => {
    host.durum = 'okunacak';
    fixture.detectChanges();
    const el = elemaniAl();
    expect(el.style.backgroundColor).toBe('rgb(229, 231, 235)');
    expect(el.style.color).toBe('rgb(55, 65, 81)');
  });

  it(`durum 'okunuyor' iken sari renkleri uygulamali`, () => {
    host.durum = 'okunuyor';
    fixture.detectChanges();
    const el = elemaniAl();
    expect(el.style.backgroundColor).toBe('rgb(254, 243, 199)');
    expect(el.style.color).toBe('rgb(146, 64, 14)');
  });

  it(`durum 'okundu' iken yesil renkleri uygulamali`, () => {
    host.durum = 'okundu';
    fixture.detectChanges();
    const el = elemaniAl();
    expect(el.style.backgroundColor).toBe('rgb(209, 250, 229)');
    expect(el.style.color).toBe('rgb(6, 95, 70)');
  });

  it('durum degistiginde rengi guncellemeli', () => {
    host.durum = 'okunacak';
    fixture.detectChanges();
    expect(elemaniAl().style.color).toBe('rgb(55, 65, 81)');

    host.durum = 'okundu';
    fixture.detectChanges();
    expect(elemaniAl().style.color).toBe('rgb(6, 95, 70)');
  });

  it('gerekli stil ozelliklerini (padding, border-radius vb.) uygulamali', () => {
    host.durum = 'okunacak';
    fixture.detectChanges();
    const el = elemaniAl();
    expect(el.style.padding).toBe('4px 10px');
    expect(el.style.borderRadius).toBe('12px');
    expect(el.style.display).toBe('inline-block');
  });
});