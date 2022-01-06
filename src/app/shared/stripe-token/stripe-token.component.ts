import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeCardElement, StripeCardElementOptions, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PasswordValidation } from 'src/app/pipes/password.validator';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DrupalStripeService } from 'src/app/services/stripe.service';
import { UserService } from 'src/app/services/user.service';
import { MfaUser } from '../models/user/user';


@Component({
  selector: 'app-stripe-token',
  templateUrl: './stripe-token.component.html',
  styleUrls: ['./stripe-token.component.scss']
})
export class StripeTokenComponent implements OnInit {
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: '#525151',
        fontWeight: 600,
        fontFamily: 'Quicksand, serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':focus': {
          color: '#424770',
        },
  
        '::placeholder': {
          color: '#525151',
        }
  
      },
      invalid: {
        color: '#fa3d41',
        ':focus': {
          color: '#525151',
        },
        '::placeholder': {
          color: '#525151',
        },
      },
    }
  };







  elementsOptions:any = {
    theme: 'stripe',
    locale: 'en',
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Merriweather|Quicksand&display=swap',
      },
    ],
  };

  registrationSuccess = false;
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.email]],
    password: [''],
    confirm: [''],
    billing: ['']
  },
  {
    validators: [PasswordValidation.MatchPassword]
  }
  );
  serverError:string = '';
  token: string;
  stripeError: string;
  card: StripeCardElement;
  elements: StripeElements;
  cardHandler = this.onChange.bind(this);
  stripeTouched = false;
  public user: MfaUser;

  constructor(private router: Router, private fb: FormBuilder, private stripeService: StripeService, private stripe: DrupalStripeService, private userService: UserService, private msg: MessageService, private cd: ChangeDetectorRef, private auth: AuthService) {}

  ngOnInit(): void {
    this.stripeService.elements(this.elementsOptions).subscribe((elms) => {
      this.elements = elms;
      if(!this.card){
        this.card = this.elements.create('card', this.cardOptions);
        this.card.mount('#card-element');
        this.card.on('change', this.cardHandler);
      }
    });

  }

  onChange({ error }) {
    this.stripeTouched = true;
    if (error) {
      this.stripeError = error.message;
    } else {
      this.stripeError = null;
    }
    this.cd.detectChanges();
  }

  // bit of a gotcha need getter to have access to form controls in html
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirm() { return this.registerForm.get('confirm'); }
  get billing() { return this.registerForm.get('billing'); }

  register() {
    let data = {
      'name': [{
        'value': this.email.value,
      }],
      'mail': [{
        'value': this.email.value,
      }],
      'pass': [{
        'value': this.password.value,
      }]
    };
    //register user
    if(this.stripeTouched && !this.stripeError){
      // 1. New User
      // 2. Token
      // 3. Subscription
      this.userService.register(data).pipe(
        tap((response:any) => {
          this.user = new MfaUser(response);
        }),
        //log in for auth EPS
        switchMap(() => {
          return this.auth.login({name: this.email.value, pass: this.password.value});
        }),
        //create token
        switchMap(() => {
          const name = this.email.value;
          return this.stripeService.createToken(this.card, {name});
        }),
        // create subscription
        switchMap((response:any) => {
          const token = response.token.id;
          return this.stripe.createSubscription(this.user.uid, {token:token, plan: this.billing.value}).pipe(
            tap(() => this.auth.logout()),
            catchError((error) => {
              throw {error: {message: error.message}};
            })
          );
        }),
        //log the user in
        switchMap(() => {
          const data = {name: this.email.value, pass: this.password.value};
          return this.auth.login(data).pipe(
            tap((resp:any) => {
              this.auth.storeInfo(resp);
            })
          )
        }),
        //load the user
        switchMap((resp:any) => {
          return this.userService.getUser(resp.user_id).pipe(
            tap((user) => {
              this.userService.storeInfo(user);
              this.user = new MfaUser(user);
            })
          );
        }),
        // load the users stripe info
        switchMap(() => {
          return this.stripe.getInfo(this.user.uid).pipe(
            tap((info:any) => {
              let status = info.plan.status;
              localStorage.setItem('stripeStatus', status);
              this.auth.triggerStatusChange(true);
            })
          );
        })        
      ).subscribe(
        (resp) =>{
            this.registrationSuccess = true;
            //clears out user info
            // this.auth.logout();
            this.router.navigate(['/programs']);
          }, (err) => {
            this.msg.add({severity:'error', summary:`${err.error.message}`});
            this.serverError = err.error.message;
            this.registerForm.setErrors({server: true});
  
          }
      );
    } else {
      if(!this.stripeError){
        this.stripeError = 'Please, enter credit card information'
      }
    }

  }

}
