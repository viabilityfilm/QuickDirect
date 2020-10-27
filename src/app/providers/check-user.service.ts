import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserData } from '../providers/user-data';
import * as _ from "lodash";
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class CheckUser implements CanLoad {
  constructor(private UserData: UserData, private router: Router, public toastCtrl: ToastController) {}

  canLoad() {
    if(!_.isEmpty(this.UserData.userName)){
      if(!_.isEmpty(this.UserData.userType) && this.UserData.userType=="V"){
      
        this.showToast();
        return false;
       
      }else{
        return true;
      }
    }
  }
  async showToast(){
    const toast =  this.toastCtrl.create({
      header: `You must be Producer/Director to post synopsis..!`,
      duration: 3000,
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });

    // Present the toast at the bottom of the page
    await (await toast).present();
  }
}
