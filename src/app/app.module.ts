import { GeoFiltersComponent } from './components/filters/geo-filters/geo-filters.component';
import { SideNavComponent } from './components/core/side-nav/side-nav.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import {AgmCoreModule} from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { AddFilterComponent } from './components/filters/add-filter/add-filter.component';
import { ManageFiltersComponent } from './components/filters/manage-filters/manage-filters.component';
import { SearchFiltersComponent } from './components/filters/search-filters/search-filters.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ChartsModule } from 'ng2-charts';
import { FilterComponent } from './components/filters/filter/filter.component';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
   declarations: [
      AppComponent,
      MapComponent,
      SearchComponent,
      SearchFiltersComponent,
      AddFilterComponent,
      SideNavComponent,
      ManageFiltersComponent,
      AnalysisComponent,
      FilterComponent,
      GeoFiltersComponent
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
    }),
    ToastrModule.forRoot()
	],
   entryComponents:[AddFilterComponent],
   providers: [],
   bootstrap: [
      AppComponent
   ],
   schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
