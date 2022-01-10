import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MfaUser } from 'src/app/shared/models/user/user';
import { DrupalStripeService } from 'src/app/services/stripe.service';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  rawUser: any = this.userService.getInfo();
  user: MfaUser;
  plan: string;
  status: string;
  cancelAtEndOfPeriod: boolean;
  currentPeriodEnd: number;
  private stripeCheckoutHandler: StripeCheckoutHandler;

  constructor(private userService: UserService, private stripeService: DrupalStripeService, private stripeCheckoutLoader: StripeCheckoutLoader, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if(this.rawUser){
      
      this.userService.getUser(this.rawUser.uid[0].value).pipe(
        tap((user) => {
          this.user = new MfaUser(user);
          this.userService.storeInfo(user);
        })

      ).subscribe((resp) => {
        this.userInfoFromServer();
      });

    } else {
      this.router.navigate(['/login']);
    }
  }
  public ngAfterViewInit() {
    this.stripeCheckoutLoader.createHandler({
        key: 'pk_live_Yralrw5vIaiSy9CznPb0mbYw',
        token: (token) => {
          // likely needs to be different
            this.stripeService.createSubscription(this.user.uid, token).subscribe((resp) =>{
              this.userService.getUser(this.user.uid).subscribe(
                (user) => {
                  this.userService.storeInfo(user);
                  this.user = new MfaUser(user);
                  this.userInfoFromServer();
                  this.authService.refreshToken();
                },
                (err) => {

                }
              );
            }, (err) => {
              console.log(err);
            });
        }
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }
  userInfoFromServer(){
    if(this.user.subscriptionId){
      this.stripeService.getInfo(this.user.uid).subscribe((info:any) => {
        this.plan = info.plan.name;
        this.status = info.plan.status;
        this.cancelAtEndOfPeriod = info.plan.cancel_at_period_end;
        this.currentPeriodEnd = info.plan.current_period_end * 1000;
        localStorage.setItem('stripeStatus', this.status);
      }, (err: any) => {
  
      });
    } else {
      this.plan = 'Free';
      this.status = 'Active';
    }
  }
  unsubscribe(){
    this.stripeService.update(this.user.uid, {cancel_at_period_end: true}).subscribe((response) => {
      this.userInfoFromServer();
    },
    (error) => {

    }
    );
  }
  resubscribe(){
    this.stripeService.update(this.user.uid, {cancel_at_period_end: false}).subscribe((response) => {
      this.userInfoFromServer();
    },
    (error) => {

    }
    );
  }

  public subscribe(){
    this.stripeCheckoutHandler.open({
      email: this.user.email,
    });

  }
  public onClickCancel() {
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }
}
