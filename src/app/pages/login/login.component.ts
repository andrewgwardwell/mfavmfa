import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import {MessageService} from 'primeng/api';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { MfaUser } from 'src/app/shared/models/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;

  constructor(private authService: AuthService, private msg: MessageService, private userService: UserService, public router: Router, public stripeService: StripeService) { }

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
  login() {
    let data = {
      'name': this.name,
      'pass': this.password
    };
    this.authService.login(data).subscribe((response:any)=>{
      this.authService.storeInfo(response);
      this.msg.add({severity:'success', summary:'Logged In!'});
      
      this.userService.getUser(response.user_id).subscribe((user:any) => {
        this.userService.storeInfo(user);
        let u = new MfaUser(user);
        this.stripeService.getInfo(u.uid).subscribe((info:any) => {
          let status = info.plan.status;
          localStorage.setItem('stripeStatus', status);
          this.router.navigate(['/programs']);
        }, (err: any) => {
    
        });
      },(err) => {
        // fail silently
      });
    }, (error)=>{
      if(error.error && error.error.message){
        this.msg.add({severity:'error', summary:`Authentication failed! ${error.error.message}`});
      }
    });
  }
}
