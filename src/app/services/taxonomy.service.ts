import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {
  baseUrl: string = `${environment.apiUrl}/jsonapi/`;
  //taxonomy_term?parameters[vid]=2
  constructor(private http: HttpClient) { }
  getTaxonomy(cat:string){
    let url = `${this.baseUrl}taxonomy_term/${cat}`;
    return this.http.get(url);
  }
}
