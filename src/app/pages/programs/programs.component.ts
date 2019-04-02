import { Component, OnInit } from '@angular/core'
import { ProgramsService } from '../../services/programs.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }

  public goToNextStep(programs: any){
    console.log(programs);
  }
}
