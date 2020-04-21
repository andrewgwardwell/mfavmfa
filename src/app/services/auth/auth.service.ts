import { Injectable } from '@angular/core';
import {HttpRequest} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { MfaUser } from 'src/app/shared/models/user/user';

@Injectable()
export class AuthService {

  constructor(public http: HttpClient, public router: Router, public msg: MessageService){}
  cachedRequests: Array<HttpRequest<any>> = [];

  // client_secret: string = 'timetime';
  client_secret: string = 'ageL1JB1@!a3K2Jzj';
  client_uuid: string = 'c51b094f-1e30-4fe7-a878-94eaff5cfecc';
  // client_uuid: string = '846e0301-6137-46e1-8ace-3b6ce25863f4';
  authUrl = `${environment.apiUrl}/oauth/`;
  // authUrl = `/oauth/`;
  statusChange = new Subject<boolean>();

  login(creds: any){
    let url = this.authUrl+'token';
    let body = new FormData();
    body.append('username', creds.name);
    body.append('password', creds.pass);
    body.append('grant_type', 'password');
    body.append('client_id', this.client_uuid);
    body.append('client_secret', this.client_secret);
    return this.http.post(url, body);
  }

  refreshToken(){
    let url = this.authUrl+'token';
    let body = new FormData();
    let refresh = this.getRefreshToken();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refresh);
    body.append('client_id', this.client_uuid);
    body.append('client_secret', this.client_secret);
    this.http.post(url, body).subscribe((response) => {
      this.storeInfo(response);
    }, (error) => {
      this.msg.add({severity:'warning', summary:'Please, Login!'});
      this.router.navigate(['/login']);
    });
  }

  storeInfo(details: any){
    let info = JSON.stringify(details);
    localStorage.setItem('authInfo', info);
  }

  public getRefreshToken(): string {
    let info: any = JSON.parse(localStorage.getItem('authInfo'));
    if(info){
      let token: string = info.refresh_token;
      return token;
    }
    return '';
  }

  public getToken(): string {
    let info: any = JSON.parse(localStorage.getItem('authInfo'));
    if(info){
      let token: string = info.access_token;
      return token;
    }
    return '';
  }

  loginStatus(){
    let token= this.getToken();
    let url = `${this.authUrl}debug?_format=json`;
    let headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get(url, {headers: headers});
  }
  
  logout(){
    this.removeUserInfo();
    this.statusChange.next(false);
  }

  public removeUserInfo(){
    localStorage.clear();
  }

  public collectFailedRequest(request): void {
      this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
      // retry the requests. this method can
      // be called after the token is refreshed
      this.cachedRequests.forEach((req) => {
        // Not sure that we need this for MVP
      });
  }
  public triggerStatusChange(change:boolean){
    this.statusChange.next(change);
  }
}