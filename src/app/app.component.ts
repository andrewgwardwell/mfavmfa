import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None  
})
export class AppComponent{
  title = 'ng-mfa';

  constructor(private router: Router){
    this.router.events.subscribe((route) => {
      if(route instanceof NavigationEnd){
        window.scrollTo(0, 0);
      }
    });
  }
  
}
