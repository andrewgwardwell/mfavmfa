import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core'
import { ProgramsService } from '../../services/programs.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  @Input() programs: any;
  public params: any = {offset: 0, limit: 50, search: ''};
  public first = 0;
  public totalRecords: number;
  public selectedPrograms: any = [];
  public draggedProg = null;
  public loading = false;
  public fileUrl = environment.fileUrl;

  constructor(private programService: ProgramsService) { }

  ngOnInit() {
  }

  dragStart(event,program) {
    this.draggedProg = program;
  }

  drop(event: any) {
      if(this.draggedProg) {
        this.addProgram(this.draggedProg);
        this.draggedProg = null;
      }
  }

  addProgram(event: any){
    this.onward(event);
  }


  dragEnd(event) {
      this.draggedProg= null;
  }

  onward(program: any) { // You can give any function name
    this.nextStep.emit(program);
  }

}
