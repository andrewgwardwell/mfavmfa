import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class EntityService {
  baseUrl: string = `${environment.apiUrl}/jsonapi/`;
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
  getEntityByName(type: string, name: string, includes?:Array<string>){
    let naming = this.getClassFromString(type);
    let inc = this.buildIncludes(includes);
    let url = `${this.baseUrl}${naming[0]}/${naming[1]}${inc}&filter[title][path]=title&filter[title][value]=${name}&filter[title][operator]==`;
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
  savePrograms(data: any){
    let url = `/node?_format=json`;
    return this.http.post(url, data);
  }
  updatePrograms(nid: number, data: any){
    let url = `/node/${nid}?_format=json`;
    return this.http.patch(url, data);
  }
  getProgram(id: number){
    let url = `/node/${id}?_format=json`;
    return this.http.get(url);
  }
  getProgramsByUid(uid:any){
    let url = `${this.baseUrl}node/comparison?filter[uid.uid][value]=${uid}&include=field_programs`;
    return this.http.get(url);
  }
}
