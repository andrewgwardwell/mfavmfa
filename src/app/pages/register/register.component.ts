import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  constructor(private userService: UserService) { }

  ngOnInit() {

  }


  register() {
    let data = {
      'name': [{
        'value': this.email,
      }],
      'mail': [{
        'value': this.email,
      }],
      'pass': [{
        'value': this.password,
      }]
    };
    this.userService.register(data).subscribe((response)=>{
      console.log(response);
    }, (error)=>{
      console.log(error);

    });
  }
}
