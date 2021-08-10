import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { MfaUser } from '../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  constructor(private userService: UserService){}
  
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // returns true if the user object
    const subStatus = localStorage.getItem("stripeStatus");
    const user = new MfaUser(this.userService.getInfo());

    if(subStatus === 'active' || user.appRole && user.appRole === 'Freeloader' ||user.isAdmin){
      return true;
    }
    return false;
  }
}
