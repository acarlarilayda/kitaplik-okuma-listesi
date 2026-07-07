import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BooksService } from '../../services/books.service';
import { Book } from '../../models/book.model';

import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss'
})
export class BooksListComponent {
  // Servisten gelen ham kitap listesi (signal olarak tutuyoruz)
  books = signal<Book[]>([]);

  // Arama kutusuna yazılan metin
  searchTerm = signal('');

  // Sıralama bilgisi
  sortKey = signal<keyof Book | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Silme onayı için: silinmek istenen kitabın id'si
  deleteTargetId = signal<number | null>(null);

  // Yükleniyor durumu (localStorage anlık okunduğu için burada kısa bir gösterim amaçlı)
  isLoading = signal(true);

  // DataTable'a gönderilecek sütun tanımları
  columns: TableColumn<Book>[] = [
    { key: 'ad', header: 'Kitap Adı', sortable: true },
    { key: 'yazar', header: 'Yazar', sortable: true },
    { key: 'tur', header: 'Tür', sortable: true },
    { key: 'durum', header: 'Durum', sortable: true },
    { key: 'puan', header: 'Puan', sortable: true }
  ];

  // ARAMA + FİLTRE: arama kutusuna göre kitapları filtreliyor
  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allBooks = this.books();

    if (!term) return allBooks;

    return allBooks.filter(book =>
      book.ad.toLowerCase().includes(term) ||
      book.yazar.toLowerCase().includes(term)
    );
  });

  // SIRALAMA: filtrelenmiş listeyi sıralıyor
  sortedBooks = computed(() => {
    const list = this.filteredBooks();
    const key = this.sortKey();

    if (!key) return list;

    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (valA > valB) return direction;
      if (valA < valB) return -direction;
      return 0;
    });
  });

  constructor(
    private booksService: BooksService,
    private router: Router
  ) {
    this.booksService.books$.subscribe(list => {
      this.books.set(list);
      this.isLoading.set(false);
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onSortChange(event: { key: keyof Book; direction: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
  }

  goToAddBook(): void {
    this.router.navigate(['/kitaplar/ekle']);
  }

  onEdit(book: Book): void {
    this.router.navigate(['/kitaplar', book.id, 'duzenle']);
  }

  onDeleteRequest(book: Book): void {
    this.deleteTargetId.set(book.id);
  }

  onDeleteConfirm(): void {
    const id = this.deleteTargetId();
    if (id !== null) {
      this.booksService.deleteBook(id);
      this.deleteTargetId.set(null);
    }
  }

  onDeleteCancel(): void {
    this.deleteTargetId.set(null);
  }
}