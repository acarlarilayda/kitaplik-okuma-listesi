import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DataTableComponent, TableColumn } from './data-table.component';

interface TestSatiri {
  id: number;
  ad: string;
  durum: string;
  puan: number;
  eklenmeTarihi: string;
}

describe('DataTableComponent', () => {
  let component: DataTableComponent<TestSatiri>;
  let fixture: ComponentFixture<DataTableComponent<TestSatiri>>;

  const ornekVeri: TestSatiri[] = [
    { id: 1, ad: 'Suç ve Ceza', durum: 'okundu', puan: 5, eklenmeTarihi: '2026-01-01' },
    { id: 2, ad: 'Dune', durum: 'okunacak', puan: 4, eklenmeTarihi: '2026-02-01' }
  ];

  const ornekKolonlar: TableColumn<TestSatiri>[] = [
    { key: 'ad', header: 'Ad', sortable: true },
    { key: 'durum', header: 'Durum', sortable: false },
    { key: 'puan', header: 'Puan', sortable: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableComponent]
    });

    fixture = TestBed.createComponent<DataTableComponent<TestSatiri>>(DataTableComponent);
    component = fixture.componentInstance;
    component.data = ornekVeri;
    component.columns = ornekKolonlar;
  });

  it('bir component olusturulmali', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('varsayilan showActions true olmali', () => {
    expect(component.showActions).toBe(true);
  });

  it('data kadar satir render edilmeli', () => {
    fixture.detectChanges();

    const satirlar = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(satirlar.length).toBe(2);
  });

  it('kolon basliklari DOMda dogru gosterilmeli', () => {
    fixture.detectChanges();

    const basliklar = fixture.nativeElement.querySelectorAll('th');
    const baslikMetni = Array.from(basliklar).map((th: any) => th.textContent.trim());

    expect(baslikMetni.some(t => t.includes('Ad'))).toBe(true);
    expect(baslikMetni.some(t => t.includes('Durum'))).toBe(true);
    expect(baslikMetni.some(t => t.includes('Puan'))).toBe(true);
  });

  it('data bossa bos durum satiri gosterilmeli', () => {
    component.data = [];
    fixture.detectChanges();

    const satirlar = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(satirlar.length).toBe(1);
  });

  it('data doluysa bos durum satiri gosterilmemeli', () => {
    fixture.detectChanges();

    const hucreler = fixture.nativeElement.querySelectorAll('tbody tr td[colspan]');
    expect(hucreler.length).toBe(0);
  });

  it('showActions false ise aksiyon butonlari gosterilmemeli', () => {
    component.showActions = false;
    fixture.detectChanges();

    const aksiyonlar = fixture.nativeElement.querySelector('.data-table__actions');
    expect(aksiyonlar).toBeNull();
  });

  it('showActions true ise Duzenle ve Sil butonlari gosterilmeli', () => {
    fixture.detectChanges();

    const duzenleBtn = fixture.nativeElement.querySelector('.data-table__btn--edit');
    const silBtn = fixture.nativeElement.querySelector('.data-table__btn--delete');

    expect(duzenleBtn).not.toBeNull();
    expect(silBtn).not.toBeNull();
  });

  it('Duzenle butonuna tiklandiginda edit eventi ilgili satirla tetiklenmeli', () => {
    spyOn(component.edit, 'emit');
    fixture.detectChanges();

    const duzenleBtn = fixture.nativeElement.querySelector('.data-table__btn--edit');
    duzenleBtn.click();

    expect(component.edit.emit).toHaveBeenCalledWith(ornekVeri[0]);
  });

  it('Sil butonuna tiklandiginda delete eventi ilgili satirla tetiklenmeli', () => {
    spyOn(component.delete, 'emit');
    fixture.detectChanges();

    const silBtn = fixture.nativeElement.querySelector('.data-table__btn--delete');
    silBtn.click();

    expect(component.delete.emit).toHaveBeenCalledWith(ornekVeri[0]);
  });

  it('onSort farkli bir key ile cagrilirsa sortKey degismeli ve sortDirection asc olmali', () => {
    component.onSort('puan');

    expect(component.sortKey).toBe('puan');
    expect(component.sortDirection).toBe('asc');
  });

  it('onSort ayni key ile tekrar cagrilirsa sortDirection desc olmali', () => {
    component.onSort('ad');
    component.onSort('ad');

    expect(component.sortDirection).toBe('desc');
  });

  it('onSort ayni key ile uc kez cagrilirsa sortDirection tekrar asc olmali', () => {
    component.onSort('ad');
    component.onSort('ad');
    component.onSort('ad');

    expect(component.sortDirection).toBe('asc');
  });

  it('onSort cagrildiginda sortChange eventi dogru key ve direction ile tetiklenmeli', () => {
    spyOn(component.sortChange, 'emit');

    component.onSort('puan');

    expect(component.sortChange.emit).toHaveBeenCalledWith({ key: 'puan', direction: 'asc' });
  });

  it('sortable olan bir basliga tiklandiginda onSort cagrilmali', () => {
    spyOn(component, 'onSort');
    fixture.detectChanges();

    const basliklar = fixture.nativeElement.querySelectorAll('th');
    const adBasligi = Array.from(basliklar).find((th: any) => th.textContent.includes('Ad')) as HTMLElement;
    adBasligi.click();

    expect(component.onSort).toHaveBeenCalledWith('ad');
  });

  it('sortable olmayan bir basliga tiklandiginda onSort cagrilmamali', () => {
    spyOn(component, 'onSort');
    fixture.detectChanges();

    const basliklar = fixture.nativeElement.querySelectorAll('th');
    const durumBasligi = Array.from(basliklar).find((th: any) => th.textContent.includes('Durum')) as HTMLElement;
    durumBasligi.click();

    expect(component.onSort).not.toHaveBeenCalled();
  });
});