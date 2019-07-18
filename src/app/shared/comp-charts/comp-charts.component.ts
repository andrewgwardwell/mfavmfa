import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-comp-charts',
  templateUrl: './comp-charts.component.html',
  styleUrls: ['./comp-charts.component.scss']
})
export class CompChartsComponent implements OnInit, OnChanges {
  @Input() programs: any;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: any = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public type = 'line';
  public lineChartPlugins = [];
  public finished = false;
  public typeLabel = 'Switch to Bar';

  constructor() {

  }

  ngOnInit() {
    this.buildChartData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if(!changes.programs.firstChange){
      this.lineChartLabels = [];
      this.lineChartData = [];
      this.buildChartData();
    }
  }
  buildChartData() {
    let poppedAttributes = [];
    this.programs.forEach((program:any) => {
      this.lineChartLabels.push(program.data.attributes.title);
      poppedAttributes.push(program.data.attributes);
    });
    let duration = this.buildDataSet('Avg. Duration', ['field_max_duration', 'field_min_duration'], 'average', poppedAttributes);
    let classSize = this.buildDataSet('Avg. Class Size', ['field_max_class_size', 'field_min_class_size'], 'average', poppedAttributes);
    this.lineChartData.push(duration);
    this.lineChartData.push(classSize);
    this.finished = true;
  }
  buildDataSet(label:string, fieldNames:Array<string>, operator:string, values:Array<any>):any{
    let data = [];
    values.forEach((val) => {
      switch(operator){
        case 'single':
          data.push(val[fieldNames[0]]);
          break;
        case 'average':
            let count = 0;
            let sum = 0;
            fieldNames.forEach(name => {
              sum += val[name];
              count++;
            });
            data.push(sum/count);
          break;
      }      
    });
    return { data: data, label: label };
  }
  public randomize(): void {
    this.type = this.type === 'bar' ? 'line' : 'bar';
    this.typeLabel = this.type === 'bar' ? 'Switch to Line' : 'Switch to Bar';
  }
}
