import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {MessageService} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;

  constructor(private authService: AuthService, private msg: MessageService, public router: Router) { }

  ngOnInit() {
  }
  logout(){
    // this.userService.logout().subscribe(
    // (resp) => {
    //   console.log(resp);
    // },
    // (error) => {
    //   console.log(error);
    // });
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
    this.authService.login(data).subscribe((response)=>{
      this.authService.storeInfo(response);
      this.msg.add({severity:'success', summary:'Logged In!'});
      this.router.navigate(['/programs']);
    }, (error)=>{
      if(error.error && error.error.message){
        this.msg.add({severity:'error', summary:`Authentication failed! ${error.error.message}`});
      }
    });
  }
}
