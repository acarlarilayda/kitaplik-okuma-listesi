import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() mesaj: string = 'Henuz kayit yok';
  @Input() butonMetni: string = 'Ekle';
  @Output() butonaTiklandi = new EventEmitter<void>();

  onButonTiklandi(): void {
    this.butonaTiklandi.emit();
  }
}