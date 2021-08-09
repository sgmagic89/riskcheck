import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RiskCheck';
  navVisible = false;
  @ViewChild('drawer',{static: true})
  public sidenav: MatSidenav = <MatSidenav>{};
  constructor() {
  }
  ngOnInit() {
    
  }
  toogleNav() {
    this.sidenav.toggle();
  }

  closeNav() {
    this.sidenav.close();
  }

}
