import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = '/user';

  constructor(public http: HttpClient) { }
  getUser(id: number){
    let url = `${this.baseUrl}/${id}?_format=json`;
    return this.http.get(url);
  }
  register(creds: any){
    let url = `${this.baseUrl}/register?_format=json`;
    return this.http.post(url, {name: creds.name, mail: creds.mail, pass: creds.pass});
  }
  login(creds: any){
    let url = `${this.baseUrl}/login?_format=json`;
    return this.http.post(url, {name: creds.name, pass: creds.pass});
  }
}
