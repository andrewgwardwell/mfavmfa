import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import {MessageService} from 'primeng/api';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { MfaUser } from 'src/app/shared/models/user/user';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    userName: [''],
    password: ['']
  });
  serverError:string = '';
  constructor(private authService: AuthService, private msg: MessageService, private userService: UserService, public router: Router, public stripeService: StripeService, public fb: FormBuilder) { }

  ngOnInit() {
  }
  logout(){
    this.authService.logout();
  }
  status(){
    this.authService.loginStatus().subscribe(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        console.log(error);
    });
  }
  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }
  login() {
    let data = {
      'name': this.userName.value,
      'pass': this.password.value
    };
    this.authService.login(data).subscribe((response:any)=>{
      this.authService.storeInfo(response);
      this.msg.add({severity:'success', summary:'Logged In!'});
      
      this.userService.getUser(response.user_id).subscribe((user:any) => {
        this.userService.storeInfo(user);
        let u = new MfaUser(user);
        if(u.subscriptionId || u.isAdmin || u.appRole && u.appRole === 'Freeloader'){
          this.stripeService.getInfo(u.uid).subscribe((info:any) => {
            let status = info.plan.status;
            localStorage.setItem('stripeStatus', status);
            this.authService.triggerStatusChange(true);
            this.router.navigate(['/programs']);
  
          }, (err: any) => {
            this.authService.logout();
          });
        } else {
          this.authService.triggerStatusChange(true);
          this.router.navigate(['/payment']);
        }
      },(err) => {

      });
    }, (error)=>{
      if(error.error && error.error.message){
        this.msg.add({severity:'error', summary:`Authentication failed! ${error.error.message}`});
        this.loginForm.setErrors({server: true});
        this.serverError = error.error.message;
      }
    });
  }
}
