import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    GoogleMapsModule,
    MenubarModule,
    ButtonModule,
    TabViewModule
  ],
  declarations: []
})
export class SharedModule { }
