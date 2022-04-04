import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { MfaUser } from 'src/app/shared/models/user/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  user = null;
  toggleOpen = false;
  constructor(private auth: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.getUser();
    this.auth.statusChange.subscribe((change) => {
      if(!change){
        this.user = null;
      } else {
        this.getUser();
      }
    });
  }
  toggleNav(){
    this.toggleOpen = !this.toggleOpen;
  }
  getUser(){
    const user = this.userService.getInfo();
    if(user){
      this.user = new MfaUser(user);
    }
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
