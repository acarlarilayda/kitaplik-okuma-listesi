import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  @Input({ required: true }) control!: AbstractControl;

get formControl(): FormControl {
  return this.control as FormControl;
}
  @Input() label = '';
  @Input() type: 'text' | 'number' | 'date' | 'textarea' | 'select' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() inputId = `field-${Math.random().toString(36).slice(2, 9)}`;

  @Input() errorMessages: Record<string, string> = {
    required: 'Bu alan zorunludur.',
    minlength: 'Girilen değer çok kısa.',
    maxlength: 'Girilen değer çok uzun.',
    invalidYear: 'Geçerli bir yıl giriniz.'
  };

  get isInvalid(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';
    const firstKey = Object.keys(this.control.errors)[0];
    return this.errorMessages[firstKey] ?? 'Geçersiz değer.';
  }
}