import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { CampaignService } from 'src/app/services/campaign.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramsService } from 'src/app/services/programs.service';
import { SimpleProgram } from 'src/app/shared/models/program/program';
import { forkJoin } from 'rxjs';
import { TaxonomyService } from 'src/app/services/taxonomy.service';
import { EntityService } from 'src/app/services/entity.service';
import { BaseChartDirective } from 'ng2-charts';
import { findKey, invert } from 'underscore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(BaseChartDirective, {static:false}) chart: BaseChartDirective | undefined;
  subStatus: string;
  signUpForm = new FormGroup({
    email: new FormControl('', Validators.email)
  });
  submitted = false;
  error = false;
  msg: string;
  programs: Array<SimpleProgram>;
  subSet: Array<SimpleProgram>;
  programCount: number;
  peopleCount: number;
  genreCount: number;
  people: Array<any>;
  genres: Array<any>;
  chartData: any;
  chartLabels: any;
  colors: any =  this.taxService.colors;
  public chartOptions: any = {
    title: {
        display: false,
    },
    legend: {
        display: false
    },
    animation: {
      durartion: 2000,
      easing: 'easeInCubic',
    }
};



  finished = false;

  constructor(
    public router: Router,
    public campaignService: CampaignService,
    public programService: ProgramsService,
    public taxService: TaxonomyService,
    public entityService: EntityService

  ) { }

  ngOnInit() {
    forkJoin(
      this.programService.getOpenPrograms(),
      this.taxService.getTaxonomy('genre')
    ).subscribe((fork) => {
      const progs: any = fork[0];
      const terms: any = fork[1];
      this.programs = progs.map(x => new SimpleProgram(x));
      this.subSet = this.getRandomSubarray(this.programs, 54)
      this.programCount = this.programs.length;
      this.genreCount = terms.data.length;
      this.genres = terms.data;
      this.readyChart();
    });


    this.entityService.getOpenPeople().subscribe((people: Array<any>) => {
      this.people = people.filter(p => p.field_image).map(p => {
        const image_url = p.field_image;
        p.image = `https://api.mfavsmfa.com${image_url}`; 
        return p;
      });
      this.peopleCount = this.people.length;

    })
  }
  onSubmit(){
    const form = this.signUpForm.value;
    this.campaignService.addSubsriber(form).subscribe(response => {
      if (response.result && response.result !== 'error') {
        this.submitted = true;
        this.msg = response.msg;
      }
      else {
        this.submitted = true;
        this.error = true;
        this.msg = response.msg;
      }
    }, error => {
      this.submitted = true;
      this.error = true;
      this.msg = 'Sorry, an error occurred.';
    });
  }

  getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

readyChart() {
  this.chartLabels = [];
  this.genres.forEach((g:any) => {
    this.chartLabels.push(g.attributes.name);
  });
  this.buildChartData();
  this.finished = true;
}

buildChartData(){
  let colors = [];
  const data = this.chartLabels.map((l:string) => {
    let data = 0;
    this.programs.forEach((p:any) => {
      const match:string = p.field_genre;
      if(match.indexOf(l) > -1){
        data++;
      }
    });
    const invColors = invert(this.colors);
    const cKey = findKey(invColors, (v: string) => {
      return l.indexOf(v) > -1;
    });
    const color = cKey ? cKey : "#525151";
    colors.push(cKey);
    //find all progs with genre
    return data;
  });
  this.chartData = {
    labels: this.chartLabels,
    datasets: [
        {
            label: '# of Programs',
            data: data,
            backgroundColor: colors
        }
    ]
  };

}
}
