import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    });

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
  });

  it('bir component olusturulmali', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('varsayilan mesaj degeri dogru olmali', () => {
    expect(component.mesaj).toBe('Yukleniyor...');
  });

  it('mesaj DOMda dogru gosterilmeli', () => {
    fixture.detectChanges();

    const mesajEl = fixture.nativeElement.querySelector('.loading-spinner__mesaj');
    expect(mesajEl.textContent).toContain('Yukleniyor...');
  });

  it('ozel mesaj verilirse DOMda dogru gosterilmeli', () => {
    component.mesaj = 'Kitaplar yukleniyor...';
    fixture.detectChanges();

    const mesajEl = fixture.nativeElement.querySelector('.loading-spinner__mesaj');
    expect(mesajEl.textContent).toContain('Kitaplar yukleniyor...');
  });

  it('spinner gostergesi DOMda render edilmeli', () => {
    fixture.detectChanges();

    const spinnerEl = fixture.nativeElement.querySelector('.loading-spinner__cember');
    expect(spinnerEl).not.toBeNull();
  });
});