import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BooksService } from '../../services/books.service';
import { KitapDurumu } from '../../models/book.model';
import { positiveIntegerValidator, ratingRangeValidator } from '../../../../shared/validators/books.validators';

import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { FormDegisiklikleriVar } from '../../../../core/guards/unsaved-changes.guard';
@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './books-form.component.html',
  styleUrl: './books-form.component.scss'
})
export class BooksFormComponent implements OnInit, FormDegisiklikleriVar {
  form!: FormGroup;

  // Düzenleme modunda mıyız, yoksa yeni ekleme modunda mı?
  isEditMode = signal(false);

  // Düzenlenen kitabın id'si (varsa)
  private editingId: number | null = null;

  // Durum dropdown'ı için seçenekler
  durumOptions: { value: KitapDurumu; label: string }[] = [
    { value: 'okunacak', label: 'Okunacak' },
    { value: 'okunuyor', label: 'Okunuyor' },
    { value: 'okundu', label: 'Okundu' }
  ];

  constructor(
    private fb: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      ad: ['', [Validators.required]],
      yazar: ['', [Validators.required]],
      tur: [''],
      durum: ['okunacak', [Validators.required]],
      sayfaSayisi: [null, [positiveIntegerValidator()]],
      puan: [null, [ratingRangeValidator()]],
      not: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      const existingBook = this.booksService.getBookById(id);

      if (existingBook) {
        this.isEditMode.set(true);
        this.editingId = id;
        this.form.patchValue(existingBook);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode() && this.editingId !== null) {
      this.booksService.updateBook(this.editingId, formValue);
    } else {
      this.booksService.addBook(formValue);
    }
this.form.markAsPristine();
    this.router.navigate(['/kitaplar']);
  }

  onCancel(): void {
    this.router.navigate(['/kitaplar']);
  }
  formDegistiMi(): boolean {
    return this.form.dirty;
  }
}