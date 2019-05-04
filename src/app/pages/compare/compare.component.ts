import { Component, OnInit } from '@angular/core';
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  seedPrograms: Array<any>;
  constructor(private programService: ProgramsService) { }

  ngOnInit() {

  }

}
