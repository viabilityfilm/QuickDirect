import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Trending',
      url: '/app/tabs/schedule',
      icon: 'trending-up'

    },
    {
      title: 'Category',
      url: '/app/tabs/speakers',
      icon: 'folder-open'

    },
    {
      title: 'Favorites',
      url: '/app/tabs/map',
      icon: 'images'

    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information'
    }
  ];
  loggedIn = false;
  dark = false;
  disconnectSubscription: any;
  connectSubscription: any;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: LottieSplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private network: Network

  ) {
    this.initializeApp();
  }
  async ngOnDestroy(){
    this.disconnectSubscription.unsubscribe();
    this.connectSubscription.unsubscribe();
  }
  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      console.log('disconnected');
      const toast =  this.toastCtrl.create({
        message: 'It seems you are offline..!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'close'
          }
        ]
      });

       (await toast).present();
    });

    
  


    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(async () => {
      console.log('connected');
      const toast =  this.toastCtrl.create({
        message: 'You back to Online..!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'close'
          }
        ]
      });

       (await toast).present();
      
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          const toast =  this.toastCtrl.create({
            message: 'Got Wifi Connection..!',
            position: 'bottom',
            buttons: [
              {
                role: 'cancel',
                text: 'close'
              }
            ]
          });
        }
      }, 3000);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();

      setTimeout(() => {
        this.splashScreen.hide();
      }, 2500);
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {

  }
}
