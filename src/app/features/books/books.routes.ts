import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/books-list/books-list.component').then(m => m.BooksListComponent)
  },
  {
    path: 'ekle',
    loadComponent: () =>
      import('./pages/books-form/books-form.component').then(m => m.BooksFormComponent)
  },
  {
    path: ':id/duzenle',
    loadComponent: () =>
      import('./pages/books-form/books-form.component').then(m => m.BooksFormComponent)
  }
];