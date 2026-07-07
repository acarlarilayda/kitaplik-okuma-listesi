import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Sayfa sayısının pozitif bir tam sayı olmasını kontrol eder.
 * Alan boşsa (opsiyonel alan) hata vermez.
 */
export function positiveIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const isInteger = Number.isInteger(Number(value));
    const isPositive = Number(value) > 0;

    if (!isInteger || !isPositive) {
      return { positiveInteger: true };
    }

    return null;
  };
}

/**
 * Puanın 1 ile 5 arasında (dahil) olmasını kontrol eder.
 * Alan boşsa (opsiyonel alan) hata vermez.
 */
export function ratingRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numValue = Number(value);

    if (isNaN(numValue) || numValue < 1 || numValue > 5) {
      return { ratingRange: true };
    }

    return null;
  };
}