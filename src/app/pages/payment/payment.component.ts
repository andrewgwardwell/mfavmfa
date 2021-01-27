import { Component, OnInit } from '@angular/core';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
import { StripeService } from '../../services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { MfaUser } from 'src/app/shared/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;
  user: MfaUser;
  constructor(private stripeCheckoutLoader: StripeCheckoutLoader, private stripe: StripeService, private router: Router, private userService: UserService, private auth: AuthService, private msg: MessageService) { }

  ngOnInit() {
  }
  public ngAfterViewInit() {
    const info = this.userService.getInfo();
    this.user = new MfaUser(info);
    this.stripeCheckoutLoader.createHandler({
        key: 'pk_test_3ywXbQTf6guYBAtjZGRzrgDI',
        token: (token) => {
          // likely needs to be different
            this.stripe.createSubscription(this.user.uid, token).subscribe((resp) =>{
              this.msg.add({severity:'success', summary:`Payment Complete! Please, log back in.`});
              //clears out user info
              this.auth.logout();
              this.router.navigate(['/login']);
              
            }, (err) => {
              this.msg.add({severity:'error', summary:`${err.error.message}`});
            });
        }
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });

  }
  public subscribe(){
    this.stripeCheckoutHandler.open({
      email: this.user.email,
      closed: this.closedPayment.bind(this)
    });
  }
  public closedPayment(){
    this.msg.add({severity:'error', summary:`You have canceled your payment! Please, Log back in and try again.`});
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
