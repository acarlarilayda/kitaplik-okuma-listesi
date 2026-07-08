import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormFieldComponent]
    });

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
  });

  it('bir component olusturulmali', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('varsayilan Input degerleri dogru olmali', () => {
    expect(component.label).toBe('');
    expect(component.type).toBe('text');
    expect(component.placeholder).toBe('');
    expect(component.required).toBe(false);
  });

  it('label bos ise etiket DOMda gorunmemeli', () => {
    component.label = '';
    fixture.detectChanges();

    const labelEl = fixture.nativeElement.querySelector('.form-field__label');
    expect(labelEl).toBeNull();
  });

  it('label verilmisse etiket DOMda dogru gosterilmeli', () => {
    component.label = 'Kitap Adı';
    fixture.detectChanges();

    const labelEl = fixture.nativeElement.querySelector('.form-field__label');
    expect(labelEl.textContent).toContain('Kitap Adı');
  });

  it('required true ise zorunlu isareti gosterilmeli', () => {
    component.label = 'Kitap Adı';
    component.required = true;
    fixture.detectChanges();

    const zorunluIsareti = fixture.nativeElement.querySelector('.form-field__required');
    expect(zorunluIsareti).not.toBeNull();
  });

  it('required false ise zorunlu isareti gosterilmemeli', () => {
    component.label = 'Kitap Adı';
    component.required = false;
    fixture.detectChanges();

    const zorunluIsareti = fixture.nativeElement.querySelector('.form-field__required');
    expect(zorunluIsareti).toBeNull();
  });

  it('type text (varsayilan) ise input elementi render edilmeli', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(input).not.toBeNull();
    expect(textarea).toBeNull();
  });

  it('type textarea ise textarea render edilmeli, input render edilmemeli', () => {
    component.type = 'textarea';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(input).toBeNull();
  });

  it('type select ise ne input ne textarea render edilmemeli', () => {
    component.type = 'select';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(input).toBeNull();
    expect(textarea).toBeNull();
  });

  it('control dokunulmamis ve dirty degilse gecersiz olsa bile isInvalid false olmali', () => {
    component.control = new FormControl('', Validators.required);

    expect(component.isInvalid).toBe(false);
  });

  it('control gecersiz ve touched ise isInvalid true olmali', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();

    expect(component.isInvalid).toBe(true);
  });

  it('control gecersiz ve dirty ise isInvalid true olmali', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsDirty();

    expect(component.isInvalid).toBe(true);
  });

  it('control gecerliyse isInvalid false olmali', () => {
    component.control = new FormControl('deger', Validators.required);
    component.control.markAsTouched();

    expect(component.isInvalid).toBe(false);
  });

  it('control hatasizsa errorMessage bos string donmeli', () => {
    component.control = new FormControl('deger', Validators.required);

    expect(component.errorMessage).toBe('');
  });

  it('control required hatasi varsa dogru mesaji donmeli', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();

    expect(component.errorMessage).toBe('Bu alan zorunludur.');
  });

  it('errorMessagesde tanimli olmayan bir hata icin varsayilan mesaji donmeli', () => {
    component.control = new FormControl('');
    component.control.setErrors({ ozelHata: true });
    component.control.markAsTouched();

    expect(component.errorMessage).toBe('Geçersiz değer.');
  });

  it('hata mesaji sadece isInvalid true iken DOMda gorunmeli', () => {
    component.control = new FormControl('', Validators.required);
    fixture.detectChanges();

    let hataDiv = fixture.nativeElement.querySelector('.form-field__error');
    expect(hataDiv).toBeNull();

    component.control.markAsTouched();
    fixture.detectChanges();

    hataDiv = fixture.nativeElement.querySelector('.form-field__error');
    expect(hataDiv).not.toBeNull();
    expect(hataDiv.textContent).toContain('Bu alan zorunludur.');
  });
});