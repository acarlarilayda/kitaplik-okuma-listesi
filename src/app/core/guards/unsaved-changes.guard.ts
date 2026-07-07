import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

export interface FormDegisiklikleriVar {
  formDegistiMi: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<FormDegisiklikleriVar> = (component) => {
  const confirmDialogService = inject(ConfirmDialogService);

  if (!component.formDegistiMi || !component.formDegistiMi()) {
    return true;
  }

  return confirmDialogService.confirm({
    baslik: 'Kaydedilmemiş Değişiklikler',
    mesaj: 'Bu sayfadan ayrılırsanız yaptığınız değişiklikler kaybolacak. Devam etmek istiyor musunuz?',
    onayMetni: 'Evet, Çık',
    iptalMetni: 'Vazgeç'
  });
};