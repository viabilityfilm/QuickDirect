import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  location = 'madison';
  conferenceDate = '2047-05-17';
 
  username: string;
  posts: any={};
  email: string;
  actors:any={};
  storiescount: number=0;
  postsFilterd: number=0;
  
  constructor(public popoverCtrl: PopoverController,
    public userData:UserData,
    public fireBase:FireBaseService,public router:Router) { }

    loginCheck() {
      if (_.isEmpty(this.username)) {
        this.router.navigateByUrl('/signUp');
        return false;
      } else {
        return true;
      }
    }
  ionViewDidEnter(){
    this.getUserName();
   
    this.posts=this.fireBase.postData;
    this.actors=this.fireBase.actorRef;
    this.postsFilterd=_.filter(this.posts,{'uploadedBy':this.username});
    this.email=this.userData.email; 
    let likedStroies=0;
    this.posts.forEach(obj => {
        if(obj['likes'].indexOf(this.username)>=0){
          likedStroies++;
        }
    });
    this.storiescount=likedStroies;
  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
  }
  logout(){
    this.userData.logout().then(() => {
      this.userData.email="";
      this.userData.userType="";
      this.userData.userName="";
      return this.router.navigateByUrl('/signUp');
    });
  }
  
  getUserName() {
    this.username=this.userData.userName;
    this.loginCheck();
  }
}
