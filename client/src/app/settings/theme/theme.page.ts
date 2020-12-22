import { Component, OnInit } from '@angular/core';
import { ThemeSwitcherService } from '../../_services/theme-switcher.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.page.html',
  styleUrls: ['./theme.page.scss'],
})
export class ThemePage implements OnInit {
  themes = [
    {
      name: 'Orange',
      value: 'orange',
      color: '#000000',
      background: '#ffc409',
    },
    {
      name: 'Dark Green',
      value: 'darkgreen',
      color: '#ffffff',
      background: '#264653',
    },
    {
      name: 'Blue',
      value: 'blue',
      color: '#ffffff',
      background: '#3880ff',
    },
    {
      name: 'Red',
      value: 'red',
      color: '#ffffff',
      background: '#FC2F03',
    },
    {
      name: 'Turqouise',
      value: 'turqouise',
      color: '#000000',
      background: '#55dde0',
    },
  ];
  constructor(private themeSwitcher: ThemeSwitcherService) {}

  ngOnInit() {}

  getBackground(color: string) {
    return `--background: ${color};`
  }

  setTheme(theme: string) {
    this.themeSwitcher.setTheme(theme);
  }
}
