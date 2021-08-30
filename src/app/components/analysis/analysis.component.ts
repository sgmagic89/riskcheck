import { EarthQuakeData } from 'src/app/models/eartQuakeData.model';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {
  Color,
  Label,
  SingleDataSet,
} from 'ng2-charts';
import { combineLatest, Subscription } from 'rxjs';
import { PlaceTypeData } from 'src/app/models/placeTypeData.model';
import { MapDataService } from 'src/app/services/dataServices/mapData.service';
import { HazzardService } from 'src/app/services/logicalServices/hazzard.service';
import { LocationService } from 'src/app/services/logicalServices/location.service';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
import { ChartService } from '../../services/chartService/chart.service';
import { TableData } from 'src/app/models/tableData.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit, AfterViewInit, OnDestroy {
  placesType: PlaceTypeData[] = [];
  placeTypeSubscription: Subscription = <Subscription>{};
  score: number = 0;
  // Doughnut
  public pieChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function(tooltipItem: any, data: any) {
          return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
        }
      }
    }
  };
  
  public pieChartLabels: Label[] = [['Good'], ['Moderate'], 'Bad'];
  public pieChartData: SingleDataSet = [];
  public percentages = {};
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = false;
  public pieChartColors: Array < any > = [{
    backgroundColor: [ 'rgb(186, 245, 97)', 'rgb(252, 208, 127)', 'rgb(241, 128, 128)'],
    borderColor: ['rgb(186, 245, 97,0.2)', 'rgb(252, 208, 127,0.2)', 'rgb(241, 128, 128, 0.2)']
  }];
  public pieChartPlugins = []
  
  public categories = ['GOOD', 'MODERATE', 'BAD']
  public categorized: {
    GOOD: any[];
    BAD: any[];
    MODERATE: any[];
  } = {
    GOOD: [],
    BAD: [],
    MODERATE: [],
  };

  // line chart
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Earthquake Magnitude' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    legend: {
      display: false,
    },
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';
  earthQuakeData: EarthQuakeData = <EarthQuakeData>{};
  displayedColumns = ['no', 'type', 'name', 'address', 'distance'];
  dataSource = new MatTableDataSource<TableData>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{}

  hazardSubscription: Subscription = <Subscription>{};
  constructor(
    private chartService: ChartService,
    public locationService: LocationService,
    private mapDataService: MapDataService,
    private hazzardService: HazzardService,
    private router: Router,
    private placesService: PlacesService
  ) {
  }

  ngOnInit() {
    this.placeTypeSubscription = 
      this.mapDataService.placesData$.subscribe((result) => {
      if (result.length === 0) {
        this.placesService.mapInitialized$.subscribe((initialized) => {
          if (initialized) {
            this.placesService.analyseLocation();
          }
        });
      }
      this.placesType = result;
      this.prepareTableData(this.placesType);
      if (this.placesType.length > 0) {
        this.placesType.forEach((place) => {
          if (place.rating === 'MODERATE') {
            this.categorized.MODERATE.push(place);
          } else if (place.rating === 'BAD') {
            this.categorized.BAD.push(place);
          } else if (place.rating === 'GOOD') {
            this.categorized.GOOD.push(place);
          }
        });
        Object.keys(this.categorized);
      }
    });
    this.hazardSubscription = this.hazzardService.getEarthQuakeData().subscribe((data) => {
      this.earthQuakeData = data;
      data.allEarthQuakes?.forEach((data: any) => {
        this.lineChartData[0].data?.push(data.mag);
        this.lineChartLabels.push(
          new Date(data.time).toISOString().slice(0, 10)
        );
      });
      if (data.rating === 'MODERATE') {
        this.categorized.MODERATE.push(data);
      } else if (data.rating === 'BAD') {
        this.categorized.BAD.push(data);
      } else if (data.rating === 'GOOD') {
        this.categorized.GOOD.push(data);
      }
    });
    this.calculatePercent();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  prepareTableData(placesType: PlaceTypeData[]) {
    let i = 1;
    const tableData:TableData[] = []
    placesType.forEach((place) => {
      const type = place.placeType.displayName;
      place.data.forEach(elem => {
        const data = <TableData>{};
        data.no = i++;
        data.type = type;
        data.name = elem.name;
        data.address = elem.address;
        data.distance = elem.distance;
        tableData.push(data)
      })
    });
    this.dataSource = new MatTableDataSource<TableData>(tableData);
  }

  calculatePercent() {
    console.log('categorized data ', this.categorized);
    const sum = this.categorized.BAD.length + this.categorized.GOOD.length + this.categorized.MODERATE.length;
    const percents: number[] = [];
    const goodPercent = this.categorized.GOOD.length > 0 ? parseFloat(((this.categorized.GOOD.length/sum)*100).toFixed(2)) : 0;
    const moderatePercent = this.categorized.MODERATE.length > 0 ? parseFloat(((this.categorized.MODERATE.length/sum)*100).toFixed(2)) : 0;
    const badPercent = this.categorized.BAD.length > 0 ? parseFloat(((this.categorized.BAD.length/sum)*100).toFixed(2)) : 0;
    percents.push(goodPercent);
    percents.push(moderatePercent);
    percents.push(badPercent);
    this.pieChartData = percents;
    this.score = parseFloat((goodPercent/10).toFixed(2));
  }



  unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  goBack() {
    this.router.navigate(['configure'])
  }

  search() {
    this.router.navigate(['search']);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnDestroy() {
    this.unsubscribe(this.placeTypeSubscription);
    this.unsubscribe(this.hazardSubscription);
  }
}
