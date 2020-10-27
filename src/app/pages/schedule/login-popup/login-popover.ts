import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConferenceData } from '../../../providers/conference-data';
import { UserData } from '../../../providers/user-data';

@Component({
    template: `
    <ion-list>
      <ion-item button (click)="close('1')">
        <ion-label><ion-icon name="cog"></ion-icon> Settings</ion-label>
        
      </ion-item>
      <ion-item button (click)="close('2')">
        <ion-label> <ion-icon name="close-circle"></ion-icon> Logout</ion-label>
      </ion-item>
      
    </ion-list>
  `,
  styles: ['ion-item { --ion-background-color: black;color:white; } ion-list{--ion-background-color: black}']
})
export class LoginPopover {
    constructor(public popoverCtrl: PopoverController, public router: Router,public confData:UserData) { }

    support() {
        // this.app.getRootNavs()[0].push('/support');
        this.popoverCtrl.dismiss();
    }

    close(arg) {
        if (arg == '1') {
            this.popoverCtrl.dismiss();
            this.confData.logout().then(() => {
              return this.router.navigateByUrl('/app/tabs/about');
              
            });
        } else if (arg == '2') {
            this.popoverCtrl.dismiss();
            this.confData.logout().then(() => {
              this.confData.email="";
              this.confData.userType="";
              this.confData.userName="";
              return this.router.navigateByUrl('/signUp');
            });
        }
    }
}
