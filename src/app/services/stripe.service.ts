import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
@Injectable()

export class StripeService {
  baseUrl = `${environment.apiUrl}/mfastripe`;

  constructor(private http: HttpClient) {}

  createSubscription(id:number, token:any){
    let url = `${this.baseUrl}/${id}`;
    let data = {token: token.id};
    return this.http.post(url, data);
  }
  getInfo(id:number){
    let url = `${this.baseUrl}/${id}`;
    return this.http.get(url);
  }
  update(id:number,data: any){
    let url = `${this.baseUrl}/${id}`;
    return this.http.patch(url, data);
  }
}
