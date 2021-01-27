import { Component, OnInit } from '@angular/core';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
import { StripeService } from '../../services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MfaUser} from 'src/app/shared/models/user/user';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PasswordValidation } from 'src/app/pipes/password.validator';
import { MessageService } from 'primeng/api';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registrationSuccess = false;
  registerForm: FormGroup = this.formBuilder.group({
    userName: [''],
    email: ['', [Validators.email]],
    password: [''],
    confirm: ['']
  },
  {
    validators: [PasswordValidation.MatchPassword]
  }
  );
  serverError:string = '';
  private stripeCheckoutHandler: StripeCheckoutHandler;
  public user: MfaUser;
  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private auth: AuthService, private stripeCheckoutLoader: StripeCheckoutLoader, private stripe: StripeService, private msg: MessageService) { 
  }

  ngOnInit() {

  }
  // bit of a gotcha need getter to have access to form controls in html
  get userName() { return this.registerForm.get('userName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirm() { return this.registerForm.get('confirm'); }


  public ngAfterViewInit() {
    this.stripeCheckoutLoader.createHandler({
        key: 'pk_test_3ywXbQTf6guYBAtjZGRzrgDI',
        token: (token) => {
          // likely needs to be different
            this.stripe.createSubscription(this.user.uid, token).subscribe((resp) =>{
              this.registrationSuccess = true;
              //clears out user info
              // this.auth.logout();
              this.router.navigate(['/programs']);
            }, (err) => {
              this.msg.add({severity:'error', summary:`${err.error.message}`});
              this.serverError = err.error.message;
              this.registerForm.setErrors({server: true});
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
        'value': this.userName.value,
      }],
      'mail': [{
        'value': this.email.value,
      }],
      'pass': [{
        'value': this.password.value,
      }]
    };
    this.userService.register(data).pipe(
      tap((response:any) => {
        this.userService.storeInfo(response);
        this.user = new MfaUser(response);
      }),
      switchMap((response) => {
        return this.auth.login({name: this.userName.value, pass: this.password.value});
      })
    ).subscribe(
      (response:any)=>{
        // send to login
        this.subscribe();
      }, (error)=>{
        this.msg.add({severity:'error', summary:`${error.error.message}`});
        this.serverError = error.error.message;
        this.registerForm.setErrors({server: true});
      }
    );


  }
  
  public subscribe(){
    this.stripeCheckoutHandler.open({
      email: this.email.value
      // closed: this.closedPayment.bind(this)
    });
  }
  public closedPayment(){
    this.msg.add({severity:'error', summary:`You have canceled your payment!`});
    this.serverError = 'You canceled your payment! If you didn\'t then login and you will be able to complete the process.';
    this.registerForm.setErrors({server: true});
    this.auth.logout();
  }
  public onClickCancel() {
    // If the window has been opened, this is how you can close it:
    this.stripeCheckoutHandler.close();
  }
}
