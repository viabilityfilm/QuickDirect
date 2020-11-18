 
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  role: string;

  constructor(public router: Router,public userData:UserData
 
  ) {

  }
  ngOnInit(){
    this.userData.getRole().then((role) => {
      this.role = role;
      console.log(this.role);
    });
  }
  ionViewDidEnter(){
    this.userData.getRole().then((role) => {
      this.role = role;
      console.log(this.role);
    });
    
  }
  createPost(){
    this.router.navigateByUrl('/create-post');
  }

} 
