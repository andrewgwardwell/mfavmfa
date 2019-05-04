import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  login() {
    let data = {
      'name': this.name,
      'pass': this.password
    };
    this.userService.login(data).subscribe((response)=>{
      console.log(response);
    }, (error)=>{
      console.log(error);

    });
  }
}
