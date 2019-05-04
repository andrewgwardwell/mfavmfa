import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProgramsService {
  programsUrl = '/api/node/program/';
  constructor(private http: HttpClient) {}
  getSimplePrograms(){
    let baseUrl = 'api/custom/programs';
    return this.http.get(baseUrl);
  }
  // getPrograms(params?:any) {
  //   let offset = params && params.offset ? params.offset : 0;
  //   let offsetString = `page[offset]=${offset}`;
  //   let limit = params && params.limit ? params.limit : 50; 
  //   let limitString = `page[limit]=${limit}`;
  //   let filter = params && params.search ? params.search : null; 
  //   let filterString = '';
  //   let searchString = '?' + offsetString + '&' + limitString;
  //   if(filter){
  //     filterString = `filter[title][operator]=STARTS_WITH&filter[title][value]=${filter}`;
  //     limitString = '';
  //     searchString = '?'+ offsetString + '&' +filterString;
  //   }
  //   let url = this.programsUrl + searchString;
  //   return this.http.get(url);
  // }
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
