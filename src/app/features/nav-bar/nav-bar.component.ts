import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  navElement: HTMLElement | null;

  isDrawerOpen: boolean;
  show: boolean;
  userID: number;

  route: string;

  @Output()
  drawerToggleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private location: Location,
    private readonly userdb: UserDatabaseService
  ) {
    router.events.subscribe(val => {
      if (location.path() !== "") {
        this.route = location.path().slice(1);
      } else {
        this.route = 'dashboard';
      }
    });
  }

  ngOnInit() {
    this.navElement = null;
    this.isDrawerOpen = false;
    this.show = true;
  }

  ngAfterViewInit() {
    this.navElement = <HTMLElement>document.getElementById('navbar');
  }

  getTabClass(input: string) {
    if (input === this.route) {
      return 'current-tab-class';
    }

    return '';
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event: Event) {
    if (!this.navElement) return;

    let scrollFactor = 200;
    let opacity = window.pageYOffset / scrollFactor;
    opacity = opacity < 1 ? opacity : 1;

    if (opacity <= 1) {
      this.navElement.style.backgroundColor =
        'rgba(255, 255, 255, ' + opacity + ')';
    }

    if (window.pageYOffset / scrollFactor > 1) {
      this.navElement.classList.add('navbar-shadow');
    } else {
      this.navElement.classList.remove('navbar-shadow');
    }
  }
}
