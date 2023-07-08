import { Component, HostBinding, Output } from '@angular/core';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WWC 2023 Draft Club';
  name = 'NavigationBarProject';

  factorialResult: number = 0;
  factorialInput: number = navigator.hardwareConcurrency;
  testTimer: number = 0;

  @HostBinding('class.drawer-open')
  isDrawerOpen: boolean = false;

  toggleDrawer(isDrawerOpen: boolean) {
    this.isDrawerOpen = isDrawerOpen;
  }

  constructor() {}
}
