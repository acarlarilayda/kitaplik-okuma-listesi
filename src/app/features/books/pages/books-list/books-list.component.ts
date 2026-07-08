import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BooksService } from '../../services/books.service';

import { DataTableComponent, TableColumn } from '../../../../shared/components/data-table/data-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Book, KitapDurumu } from '../../models/book.model';

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

  // Durum filtresi ('hepsi' = filtre yok)
  durumFiltre = signal<KitapDurumu | 'hepsi'>('hepsi');

  // Tür filtresi ('hepsi' = filtre yok)
  turFiltre = signal<string>('hepsi');

  // Mevcut kitaplardaki benzersiz türlerin listesi (dropdown için)
  turListesi = computed(() => {
    const turler = this.books()
      .map(b => b.tur)
      .filter((tur): tur is string => !!tur);
    return Array.from(new Set(turler)).sort();
  });
 
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
  { key: 'puan', header: 'Puan', sortable: true },
  { key: 'eklenmeTarihi', header: 'Eklenme Tarihi', sortable: true }
];

// İSTATİSTİKLER: kart alanı için hesaplanan sayılar
  stats = computed(() => {
    const list = this.books();
    return {
      toplam: list.length,
      okunacak: list.filter(b => b.durum === 'okunacak').length,
      okunuyor: list.filter(b => b.durum === 'okunuyor').length,
      okundu: list.filter(b => b.durum === 'okundu').length
    };
  });

  // ARAMA + FİLTRE: arama kutusuna göre kitapları filtreliyor
  filteredBooks = computed(() => {
  const term = this.searchTerm().toLowerCase().trim();
  const durum = this.durumFiltre();
  const tur = this.turFiltre();
  const allBooks = this.books();

  return allBooks.filter(book => {
    const aramaUyumu = !term ||
      book.ad.toLowerCase().includes(term) ||
      book.yazar.toLowerCase().includes(term);

    const durumUyumu = durum === 'hepsi' || book.durum === durum;
    const turUyumu = tur === 'hepsi' || book.tur === tur;

    return aramaUyumu && durumUyumu && turUyumu;
  });
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
  this.booksService.books$
    .pipe(takeUntilDestroyed())
    .subscribe(list => {
      this.books.set(list);
      this.isLoading.set(false);
    });
}

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
  
  onDurumFiltreChange(value: string): void {
    this.durumFiltre.set(value as KitapDurumu | 'hepsi');
  }

  onTurFiltreChange(value: string): void {
    this.turFiltre.set(value);
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