import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ProgramsService } from '../../services/programs.service';
import { EntityService } from '../../services/entity.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { trigger,state,style,transition,animate } from '@angular/animations';
import { Comparison } from 'src/app/shared/models/comparison/comparison';
import { MfaUser } from 'src/app/shared/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { cloneDeep } from 'lodash';
import { Person } from 'src/app/shared/models/person/person';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Program } from 'src/app/shared/models/program/program';

@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.scss"],
  animations: [
    trigger("rowExpansionTrigger", [
      state(
        "void",
        style({
          transform: "translateY(-10%)",
          opacity: 0
        })
      ),
      state(
        "active",
        style({
          transform: "translateY(0)",
          opacity: 1
        })
      ),
      transition("* <=> *", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)"))
    ])
  ]
})
export class ProgramsComponent implements OnInit {
  constructor(
    private programsService: ProgramsService,
    private userService: UserService,
    private entityService: EntityService,
    public msg: MessageService,
    public auth: AuthService,
    public router: Router,
    private modalService: NgbModal
  ) {}
  public leafletOptions: any = {
    layers: [
    //   tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    // center: latLng(46.879966, -121.726909)
  };
  public programs: Array<any>;
  public peoplePrograms: Array<any>;
  public tomorrow = new Date(2017, 9, 20, 14,34);
  public selectablePrograms: Array<any>;
  public totalPrograms: Array<any>;
  public loading = false;
  public sidebar = false;
  public hasComparison = false;
  public genres: any;
  public residencyTypes: any;
  public subStatus: string;
  public user: MfaUser;
  public comparison: any;
  public compNid: number;
  private relEnts = [
    "field_faculty_fiction",
    "field_faculty_fiction.field_image",
    "field_faculty_fiction.field_books",
    "field_faculty_fiction.field_books.field_cover"
  ];
  private relGrouping = [
    // 'field_faculty_cnfiction',
    // 'field_faculty_fiction',
    // 'field_faculty_poetry',
    "taxonomy_term--genre",
    "taxonomy_term--residency_type"
  ];

  ngOnInit() {
    // gets the stored programs
    // if (this.subStatus && this.subStatus == "active") {
      this.loading = true;
      this.user = new MfaUser(this.userService.getInfo());
      this.programs = [];
      this.peoplePrograms = [];
      this.loadTertiaryData();
      this.getSimplePrograms();
      this.entityService.getProgramsByUid(this.user.uid).subscribe(
        (response: any) => {
          if(response.data && response.data.length > 0){
            let loadArray = [];
            let included = [];
            this.hasComparison = true;
            this.comparison = response.data;
            this.compNid = response.data[0].attributes.drupal_internal__nid;
            response.included.forEach((program: any) => {
              program.uuid = program.id;
              included.push(program);
              loadArray.push(this.progloader(program));
            });
            const waiter = forkJoin(loadArray);
            waiter.subscribe((fullProgs) => {
              fullProgs.forEach((fp, index) => {
                this.progLoadedFormatter(fp, included[index]);
                if((fullProgs.length - 1) == index){
                  this.loading = false;
                }
              });
            });
          } else {
            this.loading = false;
            this.sidebar = true;
          }
        },
        error => {
          this.msg.add({
            severity: "error",
            summary: `There was an issue retrieving your programs! ${error.message}`
          });
        }
      );
  }
  public loadTertiaryData() {
    this.entityService
      .getEntities("taxonomy_term--genre")
      .subscribe(response => {
        this.genres = response;
      });
    this.entityService
      .getEntities("taxonomy_term--residency_type")
      .subscribe(response => {
        this.residencyTypes = response;
      });
  }
  public openModal(modal){
    this.modalService.open(modal, {size: 'xl'});
  }
  public getSimplePrograms() {
    // this.loading = true;
    this.programsService.getSimplePrograms().subscribe(
      (response: any) => {
        this.totalPrograms = response;
        response.forEach(prog => {
          let genres = prog.field_genre && prog.field_genre.length > 0 ? prog.field_genre.split("|") : [];
          let toClassGenres = [];
          let toClassType = [];
          genres.forEach(g => {
            toClassGenres.push(g.replace(/ /g, '-'));
          });
          let res_type = prog.field_residency_type ? prog.field_residency_type.split("|") : [];
          res_type.forEach(t => {
            toClassType.push(t.replace(/ /g, '-'));
          })
          prog.genres = toClassGenres;
          prog.residency_type = toClassType;

        });
        this.selectablePrograms = response.map(x => Object.assign({}, x));
        this.removeProgramsFromList();
      },
      error => {
        // this.loading = false;
        this.msg.add({
          severity: "error",
          summary: `There was an issue retrieving your programs!`
        });
      }
    );
  }

  public progloader(newProgram: any) {
    return this.entityService.getEntityById("node--program", newProgram.uuid, this.relEnts);
  }

  public progLoadedFormatter(response: any, newProgram: any){
    response.logo = newProgram.field_logo
    ? newProgram.field_logo
    : this.getFromList(newProgram, "field_logo");
  let residency_type = newProgram.field_residency_type
    ? newProgram.field_residency_type
    : this.getFromList(newProgram, "field_residency_type");
  let genres = newProgram.field_genre
    ? newProgram.field_genre
    : this.getFromList(newProgram, "field_genre");
  response.genres =
    genres && genres.length > 0 ? genres.split("|").sort() : [];
  response.residency_type =
    residency_type && residency_type.length > 0
      ? residency_type.split("|")
      : "";
    response.plottableTime = new Date(response.data.field_application_deadline);
    response.extras = this.bundleIncluded(response);
    let programs = [...this.programs, response];
    this.programs = programs;
    this.peoplePrograms = cloneDeep(programs);
    // this.programsService.setProgramsToStorage(programs.map(prog => new Program(prog.data)) );
    this.removeProgramFromList(response);
  }
  
  // this adds a program to the list
  public goToNextStep(newProgram: any, withMsg = true) {
    this.loading = true;
    this.entityService
      .getEntityById("node--program", newProgram.uuid, this.relEnts)
      .subscribe(
        (response: any) => {
          response.logo = newProgram.field_logo
            ? newProgram.field_logo
            : this.getFromList(newProgram, "field_logo");
          let residency_type = newProgram.field_residency_type
            ? newProgram.field_residency_type
            : this.getFromList(newProgram, "field_residency_type");
          let genres = newProgram.field_genre
            ? newProgram.field_genre
            : this.getFromList(newProgram, "field_genre");
          response.genres =
            genres && genres.length > 0 ? genres.split("|").sort() : [];
          response.residency_type =
            residency_type && residency_type.length > 0
              ? residency_type.split("|")
              : "";
          response.extras = this.bundleIncluded(response);
          let programs = [...this.programs, response];
          this.programs = programs;
          this.peoplePrograms = cloneDeep(programs);
          // this.programsService.setProgramsToStorage(programs.map(prog => new Program(prog.data)));
          this.removeProgramFromList(response);
          if (withMsg) {
            this.msg.add({
              severity: "success",
              summary: `${response.data.attributes.title} added!`
            });
          }
          this.loading = false;
          this.savePrograms();
        },
        err => {
          this.loading = false;
        }
      );
  }

  public getFromList(prog: any, fieldName: string) {
    let found;
    if (this.selectablePrograms && this.selectablePrograms.length > 0) {
      this.selectablePrograms.forEach(program => {
        if (program.uuid === prog.uuid && program[fieldName]) {
          found = program[fieldName];
        }
      });
    }

    return found;
  }

  public bundleIncluded(response) {
    let included = {
      people: [],
      files: []
    };
    if (response.included) {
      response.included.forEach(item => {
        if (item.type == "node--person") {
          item.books = this.getBooks(item, response);
          included.people.push(item);
        }
        if (item.type == "file--file") {
          included.files.push(item);
        }
      });
    }
    return this.matchImagesToEntities(included);
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
        person.obj = new Person(person);
      });
    }
    return inc;
  }

  public removeProgram(prog: any) {
    this.programs.forEach((program, ind) => {
      if (prog.data.id == program.data.id) {
        this.programs.splice(ind, 1);
        // this.programsService.setProgramsToStorage(this.programs);
        this.selectablePrograms = this.totalPrograms.map(x =>
          Object.assign({}, x)
        );
        this.removeProgramsFromList();
      }
    });
    this.savePrograms();
  }

  public removeProgramsFromList() {
    this.programs.forEach(program => {
      this.removeProgramFromList(program);
    });
  }

  public peopleFilter(value: string) {
    const sample = cloneDeep(this.programs);
    let progs = sample.map((prog) => {
      prog.extras.people = prog.extras.people.filter((peep) => {
        return peep.obj.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
      return prog;
    });
    this.peoplePrograms = progs;
  }

  public removeProgramFromList(progam: any) {
    if(this.selectablePrograms)
    this.selectablePrograms.forEach((sel, ind) => {
      if (sel.uuid == progam.data.id) {
        this.selectablePrograms.splice(ind, 1);
      }
    });
  }

  getBooks(item:any, response:any){
    const books = item.relationships.field_books.data;
    let fullBooks = [];
    //pull in the entity
    if(books.length > 0){
      const bookEntities = response.included.filter(b => b.type === 'node--book');
      const files = response.included.filter(b => b.type === 'file--file');
      fullBooks = books.map((book:any) => {
        const beInd = bookEntities.findIndex((bEnt) => bEnt.id === book.id);
        const be = bookEntities[beInd];
        if(be){
          const cInd = files.findIndex((f) => f.id === be.relationships.field_cover.data.id);
          const cover = files[cInd];
          be.cover = cover;
        }
        return be;
      });
    }
    return fullBooks;
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
          this.msg.add({
            severity: "success",
            summary: `Programs updated!`
          });
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
          this.msg.add({
            severity: "success",
            summary: `Programs saved!`
          });
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
    }
  }
}
