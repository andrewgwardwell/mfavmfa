import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { ProgramsService } from '../../services/programs.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  public params: any = {offset: 0, limit: 50, search: ''};
  public first = 0;
  public totalRecords: number;
  public programs: any = [];
  public selectedPrograms: any = [];
  public draggedProg = null;
  public loading = false;
  public fileUrl = environment.fileUrl;

  constructor(private programService: ProgramsService) { }

  ngOnInit() {
    this.getSimplePrograms();
  }

  getSimplePrograms() {
    this.loading = true;
    this.programService.getSimplePrograms().subscribe(
      (respsonse: any) => {
        this.programs = respsonse;
        this.totalRecords = respsonse.length;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
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
    this.getSimplePrograms();
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

  onward() { // You can give any function name
    console.log(this.selectedPrograms);
    this.nextStep.emit({programs:this.selectedPrograms});
  }

}
