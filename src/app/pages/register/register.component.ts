import { Component, OnInit } from '@angular/core';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
import { DrupalStripeService } from '../../services/stripe.service';
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
  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private auth: AuthService, private stripeCheckoutLoader: StripeCheckoutLoader, private stripe: DrupalStripeService, private msg: MessageService) { 
  }

  ngOnInit() {

  }
  // bit of a gotcha need getter to have access to form controls in html
}
