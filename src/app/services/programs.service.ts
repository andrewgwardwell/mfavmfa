import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class ProgramsService {
  programsUrl = `${environment.apiUrl}/jsonapi/node/program/`;
  constructor(private http: HttpClient) {}
  getSimplePrograms(){
    let baseUrl = `${environment.apiUrl}/jsonapi/custom/programs`;
    return this.http.get(baseUrl);
  }
  getProgramById(id){
    let url = this.programsUrl + '/' + id;
    return this.http.get(url);
  }
  getProgramsFromStorage(){
    return JSON.parse(localStorage.getItem('programs')) || [];
  }
  setProgramsToStorage(programs:Array<any>){
    localStorage.setItem('programs', JSON.stringify(programs));
  }
}
