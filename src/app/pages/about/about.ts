import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  location = 'madison';
  conferenceDate = '2047-05-17';

  selectOptions = {
    header: 'Select a Location'
  };
  username: string;
  posts: any={};
  email: string;
  
  constructor(public popoverCtrl: PopoverController,public userData:UserData,public fireBase:FireBaseService) { }

  ionViewDidEnter(){
    this.getUserName();
    this.posts=this.fireBase.posts;
    this.posts=_.filter(this.posts,{'uploadedBy':this.username});
    this.email=this.userData.email; 
  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
  }
  
  getUserName() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }
}
