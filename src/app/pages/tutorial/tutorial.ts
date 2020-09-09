import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import {FireBaseService} from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import * as _ from "lodash";
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;

  @ViewChild('slides', { static: true }) slides: IonSlides;
  username: string;
    

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,public user:UserData,
    private firebaseService:FireBaseService
  ) {}

  ngOnInit(){
    
    let validateUSer = this.firebaseService.getUserList();
    validateUSer.snapshotChanges().subscribe(res => {
      console.log(res);
    });
  }
  startApp() {
    this.router.navigateByUrl('/signUp');
  }
  ionViewDidEnter() {
    this.getUserName();
     


  }
  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }
  getUserName() {
    setTimeout(() => {
      this.user.getUsername().then((username) => {
        this.username = username;
      });
    }, 200);
  }
  loginCheck() {
    if (!_.isEmpty(this.username)) {
      return true;
    } 
  }
  ionViewWillEnter() {
    if (this.loginCheck()) {
       this.router.navigateByUrl('/app/tabs/schedule', { replaceUrl: true });
    }
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
