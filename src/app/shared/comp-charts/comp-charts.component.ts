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
  @Input() config?: any;

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
  public selectable = true;
  public typeLabel = 'Switch to Bar';
  public fields = [
    {label: 'Quality of Life', fields: ['field_quality_of_life'], type: 'single'},
    {label: 'Rent Index', fields: ['field_rent_index'], type: 'single'},
    {label: 'Cost of Living', fields: ['field_cost_of_living'], type: 'single'},
    // {label: 'Tuition', fields: ['field_tuition'], type: 'single'},
    {label: 'Application Fee', fields: ['field_fee'], type: 'single'},
    {label: 'Avg. Duration', fields: ['field_max_duration', 'field_min_duration'], type: 'average'},
    {label: 'Avg. Class Size', fields: ['field_max_class_size', 'field_min_class_size'], type: 'average'}
  ];
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
    this.fields.forEach((config:any) =>{
      let dataSet = this.buildDataSet(config.label, config.fields, config.type, poppedAttributes);
      this.lineChartData.push(dataSet);
    });
    if(this.config){
      this.type = this.config.type == null ? this.type : this.config.type ;
      this.selectable = this.config.selectable == null ? this.selectable : this.config.selectable;
    }
    this.finished = true;
  }
  
  buildDataSet(label:string, fieldNames:Array<string>, operator:string, values:Array<any>):any{
    let data = [];
    values.forEach((val) => {
      switch(operator){
        case 'single':
          let single = val[fieldNames[0]] ? val[fieldNames[0]] : 0;
          data.push(single);
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
