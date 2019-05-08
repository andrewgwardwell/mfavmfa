import { Component, OnInit } from '@angular/core'
import { ProgramsService } from '../../services/programs.service';
import { EntityService } from '../../services/entity.service';
import {MessageService} from 'primeng/api';
import { trigger,state,style,transition,animate } from '@angular/animations';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateY(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateY(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class ProgramsComponent implements OnInit {
  constructor(private programsService: ProgramsService, private entityService: EntityService, private msg: MessageService) { }
  public programs: Array<any>;
  public selectablePrograms: Array<any>;
  public totalPrograms: Array<any>;
  public loading = false;
  public sidebar = false;
  public genres : any;
  public residencyTypes: any;
  private relEnts = [
    'field_faculty_cnfiction',
    'field_faculty_fiction',
    'field_faculty_poetry',
    'field_faculty_cnfiction.field_image',
    'field_faculty_fiction.field_image',
    'field_faculty_poetry.field_image',
    // 'field_genre',
    // 'field_residency_type',
  ];
  private relGrouping = [
    // 'field_faculty_cnfiction',
    // 'field_faculty_fiction',
    // 'field_faculty_poetry',
    'taxonomy_term--genre',
    'taxonomy_term--residency_type',
  ];

  ngOnInit() {
    // gets the stored programs
    this.loadTertiaryData();
    this.getProgramsFromLocalStorage();
    // gets the pick list
    this.getSimplePrograms();

  }
  public loadTertiaryData(){
    this.entityService.getEntities('taxonomy_term--genre').subscribe((response) => {
      this.genres = response;
    });
    this.entityService.getEntities('taxonomy_term--residency_type').subscribe((response) => {
      this.residencyTypes = response;
    });
  }
  public getSimplePrograms() {
    this.loading = true;
    this.programsService.getSimplePrograms().subscribe(
      (response: any) => {
        this.totalPrograms = response;
        this.selectablePrograms = response.map(x => Object.assign({}, x));
        this.loading = false;
        this.removeProgramsFromList();
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
  public getProgramsFromLocalStorage(){
    this.programs = this.programsService.getProgramsFromStorage();
    if(this.programs.length == 0){
      this.sidebar = true;
    }
  }

  public goToNextStep(newProgram: any){
    this.loading = true;
    this.entityService.getEntityById('node--program', newProgram.uuid, this.relEnts).subscribe((response: any) => {
      response.logo = newProgram.field_logo;
      response.genres = newProgram.field_genre.split('|');
      response.residency_type = newProgram.field_residency_type.split('|');
      response.extras = this.bundleIncluded(response);
      let programs = [...this.programs, response];
      this.programsService.setProgramsToStorage(programs);
      this.getProgramsFromLocalStorage();
      this.removeProgramFromList(response);
      this.msg.add({severity:'success', summary:`${response.data.attributes.title} added!`});
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  public bundleIncluded(response){
    let included = {
      people: [],
      files: []
    };
    if(response.included){
      response.included.forEach((item) => {
        if(item.type == 'node--person'){
          included.people.push(item);
        }
        if(item.type == 'file--file'){
          included.files.push(item);
        }
      }); 
    }
    return this.matchImagesToEntities(included);
  }

  public matchImagesToEntities(inc) {
    if(inc.files.length > 0){
      // people
      inc.people.forEach((person) => {
        if(person.relationships.field_image && person.relationships.field_image.data){
          let id = person.relationships.field_image.data.id;
          inc.files.forEach((file) => {
            if(file.id === id){
              person.image = file;
            }
          })
        }
      })
    } 
    return inc;
  }

  public removeProgram(prog: any){
    this.programs.forEach((program,ind) => {
      if(prog.data.id == program.data.id){
        this.programs.splice(ind,1);
        this.programsService.setProgramsToStorage(this.programs);
        this.selectablePrograms = this.totalPrograms.map(x => Object.assign({}, x));
        this.removeProgramsFromList();
      }
    });
  }

  public removeProgramsFromList(){
    this.programs.forEach((program) => {
      this.removeProgramFromList(program);
    });
  }

  public removeProgramFromList(progam: any){
    this.selectablePrograms.forEach((sel,ind) => {
      if(sel.uuid == progam.data.id){
        this.selectablePrograms.splice(ind,1);
      }
    });
  }
}
