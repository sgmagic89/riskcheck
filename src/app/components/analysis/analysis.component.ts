import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { Color, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { combineLatest } from 'rxjs';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { MapDataService } from 'src/app/services/dataServices/mapData.service';
import { HazzardService } from 'src/app/services/logicalServices/hazzard.service';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
import { ChartService } from '../../services/chartService/chart.service'

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit, OnDestroy {
  placesType : PlaceTypeData[]=[];
  // Doughnut
  public doughnutChartLabels:string[] = ['Good', 'Moderate', 'Bad'];
  public colors: Color[] = [
    {
      backgroundColor: [
        'green',
        'yellow',
        'red'
      ]
    }
  ];
  public demodoughnutChartData:number[][] = [[30, 50, 20]];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{beforeDraw:this.chartService.getPlugunFunction()}];
  centerText="  0  ";
  public chartOptions: any = {
    centerText: this.centerText
  };
  constructor(private chartService: ChartService,
    private locationService: LocationService,
    private mapDataService: MapDataService,
    private hazzardService: HazzardService,
    private router: Router,
    private placesService: PlacesService) { }

  ngOnInit() {
    combineLatest([
      this.locationService.getLocation(),
      this.mapDataService.placesData$
    ]
    ).subscribe(result=>{
      if(result[1].length === 0) {
        this.placesService.mapInitialized$.subscribe(initialized => {
          if(initialized) {
            this.placesService.analyseLocation();
          }
        });
      }
        this.placesType=result[1];
        this.chartOptions.centerText=" 70 ";
    })
  }
  
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  ngOnDestroy() {}
}
