import { Component, OnInit } from '@angular/core';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
import { StripeService } from '../../services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MfaUser} from 'src/app/shared/models/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  registrationSuccess = false;

  private stripeCheckoutHandler: StripeCheckoutHandler;
  public user: MfaUser;
  constructor(private userService: UserService, private auth: AuthService, private stripeCheckoutLoader: StripeCheckoutLoader, private stripe: StripeService) { }

  ngOnInit() {

  }
  public ngAfterViewInit() {
    this.stripeCheckoutLoader.createHandler({
        key: 'pk_test_3ywXbQTf6guYBAtjZGRzrgDI',
        token: (token) => {
          // likely needs to be different
            this.stripe.createSubscription(this.user.uid, token).subscribe((resp) =>{
              this.registrationSuccess = true;
              //clears out user info
              this.auth.logout();
            }, (err) => {
              console.log(err);
            });
        }
    }).then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
    });
  }
  register() {
    let data = {
      'name': [{
        'value': this.name,
      }],
      'mail': [{
        'value': this.email,
      }],
      'pass': [{
        'value': this.password,
      }]
    };
    this.userService.register(data).subscribe((response:any)=>{
      // send to login
      this.userService.storeInfo(response);
      this.user = new MfaUser(response);
      this.subscribe();
    }, (error)=>{
      console.log(error);

    });
  }
  
  public subscribe(){
    this.stripeCheckoutHandler.open({
      email: this.email,
    });

  }
  public onClickCancel() {
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }
}
