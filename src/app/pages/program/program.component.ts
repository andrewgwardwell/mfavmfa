import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { Program } from 'src/app/shared/models/program/program';
import { ProgramsService} from 'src/app/services/programs.service';
import { MessageService } from 'primeng/api';
import { Comparison } from 'src/app/shared/models/comparison/comparison';
import { MfaUser } from 'src/app/shared/models/user/user';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs';
import { findIndex } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'src/app/shared/models/person/person';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  public program: Program;
  public programs: Array<any> = this.programsService.getProgramsFromStorage();
  public chartData: Array<any>;
  public user: MfaUser = new MfaUser(this.userService.getInfo());
  public comparison: Comparison;
  public compNid: number;
  private relEnts = [
    "field_genre",
    "field_logo",
    "field_residency_type",
    "field_faculty_cnfiction",
    "field_faculty_fiction",
    "field_faculty_poetry",
    "field_faculty_cnfiction.field_image",
    "field_faculty_fiction.field_image",
    "field_faculty_poetry.field_image"
  ];
  public loading: boolean = true;
  public hasComparison = false;
  public hasProgram = false;
  public chartConfig : any = {
    type: 'bar',
    selectable: false
  };
  constructor(
    private route: ActivatedRoute,
    private entityService: EntityService,
    private programsService: ProgramsService,
    private msg: MessageService,
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    forkJoin(
      this.entityService.getProgramsByUid(this.user.uid),
      this.entityService.getEntityByName('node--program', this.route.snapshot.params.name, this.relEnts)
    ).subscribe(
      (packet: Array<any>) => {
        this.loading = false;
        if(packet[1]){
          let formatted = this.progLoadedFormatter(packet[1]);
          formatted.logoUrl = this.findLogo(formatted);
          this.program = new Program(formatted);
          this.chartData = [{data:packet[1].data[0]}];
        }
        if(packet[0].data && packet[0].data.length > 0){
          this.hasComparison = true;
          this.comparison = packet[0].data;
          this.compNid = packet[0].data[0].attributes.drupal_internal__nid;
          if(packet[0].included && packet[0].included.length > 0){
            const inIncluded = findIndex(packet[0].included, (prog: any) => { 
              console.log(prog);
              return this.program.id === prog.id
            });
            this.hasProgram = inIncluded > -1;
          }
        }

      }
    );
  }

  public progLoadedFormatter(response: any){
    response.extras = this.bundleIncluded(response);
    return response;
  }

  public bundleIncluded(response) {
    let included = {
      people: [],
      genre: [],
      files: [],
      res_type: []
    };
    if (response.included) {
      response.included.forEach(item => {
        if (item.type == "node--person") {
          included.people.push(item);
        }
        if (item.type == "taxonomy_term--genre") {
          included.genre.push(item);
        }
        if (item.type == "taxonomy_term--residency_type") {
          included.res_type.push(item);
        }
        if (item.type == "file--file") {
          included.files.push(item);
        }
      });
    }
    return this.matchImagesToEntities(included);
  }

  public findLogo(prog){
    let file;
    if(prog.data && prog.data.length > 0){
      let logoRel = prog.data[0].relationships.field_logo;
      if(logoRel && logoRel.data){
        let id = logoRel.data.id;
        prog.extras.files.forEach(f => {
          if(f.id === id){
            file = f
          }
        });
      }
    }
    return file;
  }

  public matchImagesToEntities(inc) {
    if (inc.files.length > 0) {
      // people
      inc.people.forEach(person => {
        if (
          person.relationships.field_image &&
          person.relationships.field_image.data
        ) {
          let id = person.relationships.field_image.data.id;
          inc.files.forEach(file => {
            if (file.id === id) {
              person.image = file;
            }
          });
        }
      });
    }
    return inc;
  }

    // this adds a program to the list
    public goToNextStep() {
      this.loading = true;
      this.entityService
      .getEntityById("node--program", this.program.id, this.relEnts)
      .subscribe((response:any) => {
        let programs = [...this.programs, response];
        this.programs = programs;
        this.programsService.setProgramsToStorage(programs);
        this.loading = false;
        this.savePrograms();
      });
    }
    
    public savePrograms() {
      let comparison: Comparison;
      if(this.hasComparison){
        comparison = new Comparison({
          type: 'comparison',
          title: this.comparison[0].attributes.title || `${this.user.name}-${this.user.uid}-comp`,
          programs: this.programs
        });
        this.entityService.updatePrograms(this.compNid, comparison).subscribe(
          response => {
            console.log(response);
            this.msg.add({
              severity: "success",
              summary: `Programs updated!`
            });
            this.hasProgram = true;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.msg.add({
              severity: "error",
              summary: `There was an issue saving your programs!`
            });
          }
        );
      } else {
        comparison = new Comparison({
          title: `${this.user.name}-${this.user.uid}-comp`,
          type: "comparison",
          programs: this.programs
        });
        this.loading = true;
        this.entityService.savePrograms(comparison).subscribe(
          response => {
            console.log(response);
            this.msg.add({
              severity: "success",
              summary: `Programs saved!`
            });
            this.hasProgram = true;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.msg.add({
              severity: "error",
              summary: `There was an issue saving your programs!`
            });
            console.log(error);
          }
        );
      }
    }

    public openModal(modal){
      this.modalService.open(modal, {size: 'xl'});
    }
}
