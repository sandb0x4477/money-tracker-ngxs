import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { ThemeSwitcherService } from './_services/theme-switcher.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private themeSwitcherService: ThemeSwitcherService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.themeSwitcherService.loadTheme();
    });
  }
}
