import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Color, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { ChartService } from '../../../services/chartService/chart.service'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  placesType: PlaceTypeData[]=[]
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
  constructor(private chartService: ChartService,) { }

  ngOnInit() {
    this.chartOptions.centerText=" 70 ";
  }
  
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
