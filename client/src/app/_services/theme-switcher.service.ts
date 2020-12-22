import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitcherService {
  constructor() {}

  loadTheme() {
    const theme = localStorage.getItem('theme');
    this.setTheme(theme);
  }

  async setTheme(theme: string) {
    await this.applyTheme(theme);
  }

  private applyTheme(theme: string): Promise<void> {
    return new Promise<void>(resolve => {
      if (!document) {
        resolve();
        return;
      }

      if (theme && theme !== '') {
        document.documentElement.setAttribute('theme', theme);
        localStorage.setItem('theme', theme);
      } else {
        const themeAttr: string = document.documentElement.getAttribute('theme');
        if (themeAttr) {
          document.documentElement.removeAttribute('theme');
          localStorage.removeItem('theme');
        }
      }
      resolve();
    });
  }
}
