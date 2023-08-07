import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  monsterName: string;
  monsterHealth: number;
  
  weaponName: string = 'Rainbow Bokoblin Horn Sword';
  weaponDamage: number = 50;

  monstersDefeated: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.findMonster();
  }

  doDamage(): void {
    this.monsterHealth = this.monsterHealth - this.weaponDamage;

    if (this.monsterHealth <= 0) {
        this.monstersDefeated = this.monstersDefeated + 1;
    }
  }

  findMonster(): void {
    const select = Math.floor(Math.random() * 6);
    if (select === 0) {
        this.monsterName = 'Rainbow Lynel';
        this.monsterHealth = 1000;
    } else if (select === 2) {
        this.monsterName = 'Rainbow Bokoblin';
        this.monsterHealth = 100;
    } else if (select === 3) {
        this.monsterName = 'Rainbow Lizalfos';
        this.monsterHealth = 120;
    } else if (select === 4) {
        this.monsterName = 'Rainbow Keese';
        this.monsterHealth = 5;
    } else if (select === 5) {
        this.monsterName = 'Rainbow Octorok';
        this.monsterHealth = 80;
    } else { // if (select === 1) {
        this.monsterName = 'Rainbow Moblin';
        this.monsterHealth = 115;
    }
  }

}
