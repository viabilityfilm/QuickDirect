 
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {

  constructor(public router: Router,
 
  ) {

  }
  createPost(){
    this.router.navigateByUrl('/create-post');
  }

} 
