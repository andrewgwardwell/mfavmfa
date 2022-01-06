import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs'
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from './auth.service';

@Injectable()
export class ExpiresInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, public router: Router, private msg: MessageService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
            if(err.status === 403){
                this.msg.add({severity:'warning', summary:'Please, Login!'});
            }
            // this.auth.logout();
            this.router.navigate(['/login']);
        }
      }
    });
  }
}