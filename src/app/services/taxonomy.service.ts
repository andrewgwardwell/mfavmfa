import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {
  baseUrl: string = `${environment.apiUrl}/jsonapi/`;
  colors: any = {
    Fiction:"#aa90c6",
    Poetry: "#90c6c5",
    "Non-fiction": "#c69091",
    Translation : "#8e494a",
    Environmental: "#acc690",
    Disciplinary:'#c564bd',
    Image:'#c56467',
    Young: "#c6bc90",
    Television: "#498e8c",
    Screenwriting: "#7f8e49",
    Drama: "#8e4971",
    Playwriting: "#49618e",
    Travel: "#6d8e49",
    Medicine: "#a3511b",
    Publishing: "#e08243",
    Psychogeographies: "#8e8149",
    Graphic: '#e49159'
  }

  //taxonomy_term?parameters[vid]=2
  constructor(private http: HttpClient) { }
  getTaxonomy(cat:string){
    let url = `${this.baseUrl}taxonomy_term/${cat}`;
    return this.http.get(url);
  }
}
