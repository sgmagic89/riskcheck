import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import {AgmCoreModule} from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { SindeNavComponent } from './components/core/sinde-nav/sinde-nav.component';
import { AddFilterComponent } from './components/filters/add-filter/add-filter.component';
import { ManageFiltersComponent } from './components/filters/manage-filters/manage-filters.component';
import { SearchFiltersComponent } from './components/filters/search-filters/search-filters.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/core/chart/chart.component';

@NgModule({
   declarations: [
      AppComponent,
      MapComponent,
      SearchComponent,
      SearchFiltersComponent,
      AddFilterComponent,
      SindeNavComponent,
      ManageFiltersComponent,
      AnalysisComponent,
      ChartComponent
   ],
   imports: [
	 BrowserModule,
	 BrowserAnimationsModule,
	 AppRoutingModule,
	 SharedModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA8UJo6cf5uBYRL0qMIjZrnqT1IDF_A6Dk',
      libraries: ['places']
    })
	],
   entryComponents:[AddFilterComponent],
   providers: [],
   bootstrap: [
      AppComponent
   ],
   schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
