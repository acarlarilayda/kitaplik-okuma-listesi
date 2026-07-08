import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    });

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('bir component olusturulmali', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('varsayilan Input degerleri dogru olmali', () => {
    expect(component.mesaj).toBe('Henuz kayit yok');
    expect(component.butonMetni).toBe('Ekle');
  });

  it('mesaj DOMda dogru gosterilmeli', () => {
    fixture.detectChanges();

    const mesajEl = fixture.nativeElement.querySelector('.empty-state__mesaj');
    expect(mesajEl.textContent).toContain('Henuz kayit yok');
  });

  it('ozel mesaj verilirse DOMda dogru gosterilmeli', () => {
    component.mesaj = 'Henuz kitap eklenmedi';
    fixture.detectChanges();

    const mesajEl = fixture.nativeElement.querySelector('.empty-state__mesaj');
    expect(mesajEl.textContent).toContain('Henuz kitap eklenmedi');
  });

  it('buton metni DOMda dogru gosterilmeli', () => {
    fixture.detectChanges();

    const butonEl = fixture.nativeElement.querySelector('.empty-state__buton');
    expect(butonEl.textContent).toContain('Ekle');
  });

  it('ozel buton metni verilirse DOMda dogru gosterilmeli', () => {
    component.butonMetni = 'Kitap Ekle';
    fixture.detectChanges();

    const butonEl = fixture.nativeElement.querySelector('.empty-state__buton');
    expect(butonEl.textContent).toContain('Kitap Ekle');
  });

  it('onButonTiklandi cagrildiginda butonaTiklandi eventi tetiklenmeli', () => {
    spyOn(component.butonaTiklandi, 'emit');

    component.onButonTiklandi();

    expect(component.butonaTiklandi.emit).toHaveBeenCalled();
  });

  it('butona tiklandiginda butonaTiklandi eventi tetiklenmeli', () => {
    spyOn(component.butonaTiklandi, 'emit');
    fixture.detectChanges();

    const butonEl = fixture.nativeElement.querySelector('.empty-state__buton');
    butonEl.click();

    expect(component.butonaTiklandi.emit).toHaveBeenCalled();
  });
});