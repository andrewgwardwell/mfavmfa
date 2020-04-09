import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
interface MailChimpResponse {
  result: string;
  msg: string;
}

@Injectable()
export class CampaignService {
  url:string = 'https://andrewgwardwell.us15.list-manage.com/subscribe/post-json?u=f39622b46a97a476bfc573986&amp;id=0f1b2727b4';

  constructor(private http: HttpClient) { }
  addSubsriber(data:any){
    const params = new HttpParams()
    .set('EMAIL', data.email)
    .set('b_f39622b46a97a476bfc573986_0f1b2727b4', ''); // hidden input name

    let url = `${this.url}&${params.toString()}`;
    return this.http.jsonp<MailChimpResponse>(url, 'c');
  }
}
