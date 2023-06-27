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

  async calculateFactorialMany() {
    const start = performance.now();
    let runners = 0;
    this.factorialResult = 0;

    for (let i = 0; i < 50; i++) {
      if (runners >= navigator.hardwareConcurrency) {
			//if (runners >= 1) {
        await sleep(20);
				i--;
        continue;
      }

			runners++;
      this.calculateFactorial(({ data }) => {
        runners--;
        this.factorialResult++;
      });
    }

		while (this.factorialResult < 50) {
			await sleep(20);
		}

    const end = performance.now();
    this.testTimer = end - start;
  }

  calculateFactorial(done: (this: Worker, ev: MessageEvent<any>) => any) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      // worker.onmessage = ({ data }) => {
      //   this.factorialResult = data;
      // };
      worker.onmessage = done;
      worker.postMessage(this.factorialInput);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
