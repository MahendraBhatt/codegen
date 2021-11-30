import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClientService } from '../client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../error-state-matcher';
import { Title } from '@angular/platform-browser';
import { MessageBoxService } from '../message-box.service';

@Component({
  selector: 'client-component',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  	 ClientNameFormControl = new FormControl('', [Validators.required]);
	 ClientGroupFormControl = new FormControl('', []);
	 ClientWebsiteFormControl = new FormControl('', [Validators.required]);
	 EmailDomainFormControl = new FormControl('', [Validators.required]);
	 ClientIndustryFormControl = new FormControl('', [Validators.required]);
	 AbouttheclientFormControl = new FormControl('', []);
	 ClientLogoFormControl = new FormControl('', [Validators.required]);
	 ClientHiringLocationsFormControl = new FormControl('', []);
	 MeytierAccountManagerNameFormControl = new FormControl('', [Validators.required]);
	 ClientContactNameFormControl = new FormControl('', [Validators.required]);
	 ClientContactNumberFormControl = new FormControl('', [Validators.required]);
	 ClientContactEmailFormControl = new FormControl('', [Validators.required, Validators.email]);
	 ClientStatusFormControl = new FormControl('', [Validators.required]);
	

  matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, 
              private client: ClientService, 
              private messageService:MessageBoxService, 
              private router: Router, 
              private title: Title) { }

  meytierId: any;

  ngOnInit() {
    this.title.setTitle("Manage Clients")
    this.route.params.subscribe((params) => {
      //this.meytierId = atob(atob(params.id));
    });
  }

}
