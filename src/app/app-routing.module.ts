import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { FilterComponent } from './components/filters/filter/filter.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
      { path: 'search', component: SearchComponent },
      { path: 'configure', component: FilterComponent },
      { path: 'analyze',  component: AnalysisComponent},
      { path: '', redirectTo: 'search', pathMatch: 'full'},
      { path: '**', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
