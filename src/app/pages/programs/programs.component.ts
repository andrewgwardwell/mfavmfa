import { Component, OnInit } from '@angular/core';

import { ProgramsService } from '../../services/programs.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {
  public params: any = {offset: 0, limit: 50, search: ''};
  public first = 0;
  public totalRecords: number;
  public programs: any = [];
  public selectedPrograms: any = [];
  public draggedProg = null;
  public loading = false;

  constructor(private programService: ProgramsService) { }

  ngOnInit() {
    this.getPrograms();
  }

  searchPrograms() {
    this.loading = true;
    this.params.offset = 0;
    this.first = 0;
    this.getPrograms();
  }

  getPrograms() {
    this.loading = true;
    this.programService.getPrograms(this.params).subscribe(
      (respsonse: any) => {
        this.programs = respsonse.data;
        this.totalRecords = respsonse.meta.count;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  loadData(event){
    this.first = event.first;
    this.params.offset = event.first;
    this.getPrograms();
  }

  dragStart(event,program) {
    this.draggedProg = program;
  }

  drop(event) {
      if(this.draggedProg) {
          // let draggedCarIndex = this.findIndex(this.draggedProg);
          this.selectedPrograms = [...this.selectedPrograms, this.draggedProg];
          this.draggedProg = null;
      }
  }

  dragEnd(event) {
      this.draggedProg= null;
  }

  // findIndex(prog: any) {
  //   let index = -1;
  //   for(let i = 0; i < this.programs.length; i++) {
  //       if(prog.attributes.title === this.programs[i].attributes.title) {
  //           index = i;
  //           break;
  //       }
  //   }
  //   return index;
  // }

}
