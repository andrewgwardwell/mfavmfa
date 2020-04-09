import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CampaignService } from 'src/app/services/campaign.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subStatus: string;
  signUpForm = new FormGroup({
    email: new FormControl('', Validators.email)
  });
  submitted = false;
  error = false;
  msg: string;

  constructor(
    public router: Router,
    public campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.subStatus = localStorage.getItem("stripeStatus");
    if (this.subStatus && this.subStatus == "active") {
        this.router.navigate(['/programs']);
    } else {
      
    }
  }
  onSubmit(){
    const form = this.signUpForm.value;
    this.campaignService.addSubsriber(form).subscribe(response => {
      if (response.result && response.result !== 'error') {
        this.submitted = true;
        this.msg = response.msg;
      }
      else {
        this.submitted = true;
        this.error = true;
        this.msg = response.msg;
      }
    }, error => {
      this.submitted = true;
      this.error = true;
      this.msg = 'Sorry, an error occurred.';
    });
  }

}
