import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.page.html',
  styleUrls: ['./decision.page.scss'],
})
export class DecisionPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, private router: Router) { }

  ngOnInit() {
   
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
  }
  navigate(arg) {
    this.router.navigateByUrl(arg);
  }
   

}
