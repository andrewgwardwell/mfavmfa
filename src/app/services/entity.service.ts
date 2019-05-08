import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EntityService {
  baseUrl: string = '/api/';
  constructor(private http: HttpClient) { }

  getEntities(type:string){
    return this.getEntityById(type);
  }
  getEntityById(type:string, id?:string, includes?:Array<string>){
    let naming = this.getClassFromString(type);
    let inc = this.buildIncludes(includes);

    let url = this.baseUrl + naming[0] + '/' + naming[1] + '/' + (id?id:'') + inc;
    return this.http.get(url);
  }
  getClassFromString(type:string){
    return type.split('--');
  }
  buildIncludes(includes: Array<string>){
    if(includes && includes.length > 0){
      let query = '?include=' + includes.join(',');
      return query;
    }
    return '';
  }
}
