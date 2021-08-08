import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import {AgmCoreModule} from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { SearchFiltersComponent } from './components/search/search-filters/search-filters.component';
import { AddFilterComponent } from './components/search/add-filter/add-filter.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      MapComponent,
      SearchComponent,
      SearchFiltersComponent,
      AddFilterComponent
   ],
   imports: [
	 BrowserModule,
	 BrowserAnimationsModule,
	 AppRoutingModule,
	 SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA8UJo6cf5uBYRL0qMIjZrnqT1IDF_A6Dk',
      libraries: ['places']
    })
	],
   entryComponents:[AddFilterComponent],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
