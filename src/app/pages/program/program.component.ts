import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { Program } from 'src/app/shared/models/program/program';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  public program: any;
  private relEnts = [
    "field_faculty_cnfiction",
    "field_faculty_fiction",
    "field_faculty_poetry",
    "field_faculty_cnfiction.field_image",
    "field_faculty_fiction.field_image",
    "field_faculty_poetry.field_image"
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService
  ) {}

  ngOnInit() {
    console.log();
    this.entityService.getEntityByName('node--program', this.route.snapshot.params.name, this.relEnts).subscribe(response => {
      let formatted = this.progLoadedFormatter(response);
      this.program = new Program(formatted);
      console.log(this.program);
    }, error => {

    });
  }

  public progLoadedFormatter(response: any){
    response.extras = this.bundleIncluded(response);
    return response;
  }

  public bundleIncluded(response) {
    let included = {
      people: [],
      files: []
    };
    if (response.included) {
      response.included.forEach(item => {
        if (item.type == "node--person") {
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
      });
    }
    return inc;
  }

}
