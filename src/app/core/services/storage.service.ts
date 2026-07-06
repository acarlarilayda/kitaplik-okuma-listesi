import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * localStorage'dan veri okur ve JSON olarak parse eder.
   * Veri yoksa veya bozuksa varsayilan degeri doner.
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`StorageService: "${key}" okunurken hata olustu`, error);
      return defaultValue;
    }
  }

  /**
   * Veriyi JSON'a cevirip localStorage'a yazar.
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`StorageService: "${key}" yazilirken hata olustu`, error);
    }
  }

  /**
   * Belirtilen anahtari localStorage'dan siler.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}