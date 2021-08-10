import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { cloneDeep, intersection, findIndex } from 'lodash';
import { switchMap, tap } from 'rxjs/operators';
import { ProgramsService } from 'src/app/services/programs.service';
import { TaxonomyService } from 'src/app/services/taxonomy.service';
import { Taxonomy } from 'src/app/shared/models/taxonomy/taxonomy';
import { Program, SimpleProgram } from 'src/app/shared/models/program/program';
import { Comparison } from 'src/app/shared/models/comparison/comparison';
import { EntityService } from 'src/app/services/entity.service';
import { MfaUser } from 'src/app/shared/models/user/user';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  totalPrograms: Array<any>;
  selectablePrograms: Array<any>;
  genres: Taxonomy;
  residency_types: Taxonomy;
  programs: Array<any>;
  loading: boolean = true;
  filters: FormGroup;
  comparison: Comparison;
  hasComparison: boolean = false;
  user: MfaUser = new MfaUser(this.userService.getInfo());
  compNid: number;
  usersPrograms: Array<Program> = [];
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
  constructor(private msg: MessageService, private userService: UserService, private taxService: TaxonomyService, private programsService: ProgramsService, private fb: FormBuilder, private entityService: EntityService) { }

  ngOnInit() {
    this.filters = this.fb.group({
      name: [''],
      genres: [[]],
      resTypes: [[]]
    });
    this.filters.valueChanges.subscribe(() => {
      this.filterPrograms();
    });
    this.getSimplePrograms();
  }

  resetForm(){
    this.filters.reset({
      name: '',
      genres: [],
      resTypes: []
    });
  }

  getSimplePrograms() {
    this.loading = true;
    this.programsService.getSimplePrograms().pipe(
      switchMap((response:any) => {
        const programs = response.map(x => new SimpleProgram(x));
        this.totalPrograms = cloneDeep(programs);
        this.selectablePrograms = programs;
        return this.entityService.getProgramsByUid(this.user.uid);

      }),
      tap((packet: any) => {
          if(packet.data && packet.data.length > 0){
            this.hasComparison = true;
            this.comparison = packet.data;
            this.compNid = packet.data[0].attributes.drupal_internal__nid;
            this.usersPrograms = packet.included.map(p => new Program(p));
          }
      }),
      switchMap(() => {
        return forkJoin(
          this.taxService.getTaxonomy('genre'),
          this.taxService.getTaxonomy('residency_type')
        );
      })
    ).subscribe(
      (response) => {
        this.loading = false;
        this.genres = new Taxonomy(response[0]);
        this.residency_types = new Taxonomy(response[1]);
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  filterPrograms(){
    let progs = cloneDeep(this.totalPrograms);
    const name = this.filters.value.name;
    const genres = this.filters.value.genres;
    const types = this.filters.value.resTypes;

    if(name && name.length > 0){
      progs = progs.filter(prog => prog.title.toLowerCase().indexOf(name.toLowerCase()) > -1);
    }
    if(genres && genres.length > 0){
      progs = progs.filter(prog => {
        const inter = intersection(prog.genres, genres);
        return inter.length > 0;
      });

    }
    if(types && types.length > 0){
      progs = progs.filter(prog => {
        const inter = intersection(prog.residency_type, types)
        return inter.length > 0;
      });
    }

    this.selectablePrograms = progs;
  }

  public savePrograms() {
    let comparison: Comparison;
    if(this.hasComparison){
      comparison = new Comparison({
        type: 'comparison',
        title: this.comparison[0].attributes.title || `${this.user.name}-${this.user.uid}-comp`,
        programs: this.usersPrograms
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
          console.log(error);
        }
      );
    }
  }

      // this adds a program to the list
  public goToNextStep(newProgram: any, withMsg = true) {
    // this.loading = true;
    this.entityService
      .getEntityById("node--program", newProgram.uuid, this.relEnts)
      .subscribe(
        (response: any) => {
          const prog = new Program(response.data);
          let programs = [...this.usersPrograms, prog];
          this.usersPrograms = programs;
          this.msg.add({
            severity: "success",
            summary: `${response.data.attributes.title} added!`
          });
        

          this.savePrograms();
        },
        err => {

        }
      );
  }

  hasProgram(prog){
    return this.usersPrograms.findIndex((p) => p.id === prog.uuid) > -1;
  }

  removeProgram(prog: any) {
    this.usersPrograms.forEach((program, ind) => {
      if (prog.uuid == program.id) {
        this.usersPrograms.splice(ind, 1);
      }
    });
    this.savePrograms();
  }

}
