import { TestBed } from '@angular/core/testing';
import { unsavedChangesGuard, FormDegisiklikleriVar } from './unsaved-changes.guard';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

describe('unsavedChangesGuard', () => {
  let confirmDialogServiceMock: jasmine.SpyObj<ConfirmDialogService>;

  beforeEach(() => {
    confirmDialogServiceMock = jasmine.createSpyObj('ConfirmDialogService', ['confirm']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfirmDialogService, useValue: confirmDialogServiceMock }
      ]
    });
  });

  function guardiCalistir(component: FormDegisiklikleriVar): any {
    return TestBed.runInInjectionContext(() => unsavedChangesGuard(component as any, null as any, null as any, null as any));
  }

  it('bir guard fonksiyonu olmali', () => {
    expect(unsavedChangesGuard).toBeTruthy();
  });

  it('formDegistiMi metodu olmayan component icin true dondurmeli', () => {
    const component = {} as FormDegisiklikleriVar;
    const sonuc = guardiCalistir(component);
    expect(sonuc).toBe(true);
  });

  it('form degismemisse (formDegistiMi false donerse) true dondurmeli, dialog acilmamali', () => {
    const component: FormDegisiklikleriVar = {
      formDegistiMi: () => false
    };
    const sonuc = guardiCalistir(component);
    expect(sonuc).toBe(true);
    expect(confirmDialogServiceMock.confirm).not.toHaveBeenCalled();
  });

  it('form degismisse (formDegistiMi true donerse) confirm dialogunu acmali', () => {
    confirmDialogServiceMock.confirm.and.returnValue(Promise.resolve(true));
    const component: FormDegisiklikleriVar = {
      formDegistiMi: () => true
    };
    guardiCalistir(component);
    expect(confirmDialogServiceMock.confirm).toHaveBeenCalled();
  });

  it('kullanici onaylarsa (Evet, Cik) true dondurmeli', async () => {
    confirmDialogServiceMock.confirm.and.returnValue(Promise.resolve(true));
    const component: FormDegisiklikleriVar = {
      formDegistiMi: () => true
    };
    const sonuc = await guardiCalistir(component);
    expect(sonuc).toBe(true);
  });

  it('kullanici iptal ederse (Vazgec) false dondurmeli', async () => {
    confirmDialogServiceMock.confirm.and.returnValue(Promise.resolve(false));
    const component: FormDegisiklikleriVar = {
      formDegistiMi: () => true
    };
    const sonuc = await guardiCalistir(component);
    expect(sonuc).toBe(false);
  });
});