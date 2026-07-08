import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    });

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('bir component olusturulmali', () => {
    expect(component).toBeTruthy();
  });

  it('varsayilan Input degerleri dogru olmali', () => {
    expect(component.acikMi).toBe(false);
    expect(component.baslik).toBe('Emin misiniz?');
    expect(component.mesaj).toBe('Bu islem geri alinamaz.');
    expect(component.onayMetni).toBe('Evet, Sil');
    expect(component.iptalMetni).toBe('Vazgec');
  });

  it('acikMi false ise dialog DOMda gorunmemeli', () => {
    component.acikMi = false;
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog-arkaplan');
    expect(dialog).toBeNull();
  });

  it('acikMi true ise dialog DOMda gorunmeli', () => {
    component.acikMi = true;
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog-arkaplan');
    expect(dialog).not.toBeNull();
  });

  it('baslik ve mesaj DOMda dogru gosterilmeli', () => {
    component.acikMi = true;
    component.baslik = 'Kitabi Sil';
    component.mesaj = 'Bu kitap kalici olarak silinecek.';
    fixture.detectChanges();

    const baslikEl = fixture.nativeElement.querySelector('.dialog-kutu__baslik');
    const mesajEl = fixture.nativeElement.querySelector('.dialog-kutu__mesaj');

    expect(baslikEl.textContent).toContain('Kitabi Sil');
    expect(mesajEl.textContent).toContain('Bu kitap kalici olarak silinecek.');
  });

  it('onOnayla cagrildiginda onaylandi eventi tetiklenmeli', () => {
    spyOn(component.onaylandi, 'emit');

    component.onOnayla();

    expect(component.onaylandi.emit).toHaveBeenCalled();
  });

  it('onIptalEt cagrildiginda iptalEdildi eventi tetiklenmeli', () => {
    spyOn(component.iptalEdildi, 'emit');

    component.onIptalEt();

    expect(component.iptalEdildi.emit).toHaveBeenCalled();
  });

  it('onay butonuna tiklandiginda onaylandi eventi tetiklenmeli', () => {
    spyOn(component.onaylandi, 'emit');
    component.acikMi = true;
    fixture.detectChanges();

    const onayButonu = fixture.nativeElement.querySelector('.dialog-kutu__buton--onay');
    onayButonu.click();

    expect(component.onaylandi.emit).toHaveBeenCalled();
  });

  it('iptal butonuna tiklandiginda iptalEdildi eventi tetiklenmeli', () => {
    spyOn(component.iptalEdildi, 'emit');
    component.acikMi = true;
    fixture.detectChanges();

    const iptalButonu = fixture.nativeElement.querySelector('.dialog-kutu__buton--iptal');
    iptalButonu.click();

    expect(component.iptalEdildi.emit).toHaveBeenCalled();
  });

  it('ozel onayMetni ve iptalMetni butonlarda gosterilmeli', () => {
    component.acikMi = true;
    component.onayMetni = 'Sil';
    component.iptalMetni = 'Iptal';
    fixture.detectChanges();

    const onayButonu = fixture.nativeElement.querySelector('.dialog-kutu__buton--onay');
    const iptalButonu = fixture.nativeElement.querySelector('.dialog-kutu__buton--iptal');

    expect(onayButonu.textContent).toContain('Sil');
    expect(iptalButonu.textContent).toContain('Iptal');
  });
});