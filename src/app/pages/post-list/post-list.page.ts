import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { FireBaseService } from '../../services/firebase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from "lodash";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.page.html',
  styleUrls: ['./post-list.page.scss'],
})
export class PostListPage implements OnInit {
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  posts: any;
  username: string;
  constructor(private router: Router, public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private http: HttpClient,
    public firebaseService: FireBaseService,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config) { }

  ngOnInit() {

  }
  callCloudFunction(obj) {
    let userDetails = [];

    let userArray = [this.username, obj.uploadedBy];
    for (let i = 0; i < userArray.length; i++) {
      this.firebaseService.filterUsers(userArray[i]).get().subscribe(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          userDetails.push(doc.data());
        });
      });
      setTimeout(() => {
        if (i == 1) {
          if (userDetails.length > 0) {
            let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + userDetails[1].emailId;
            emailUrl = emailUrl + '&body=' + this.username + ' Shown interest on your story <br> Story is moved to READY TO SHOOT Queue<br> Check with producer for more details Email -' + userDetails[1].emailId + ' Mob -' + userDetails[1].mobile
            this.callService(emailUrl);
          }
        }
      }, 2000);
    }

  }
  callService(emailUrl) {
   
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    
    this.http.get(emailUrl,{ headers: headers, responseType: "text" }).subscribe(async data => {
      const alert = await this.alertCtrl.create({
        header: 'Mail Update',
        message: data,
        buttons: ['OK']
      });
      await alert.present();
    },err => {
      console.error('Oops:', err.message);
    });
  }
  getUserName() {
    setTimeout(() => {
      this.user.getUsername().then((username) => {
        this.username = username;

      });
    }, 200);
  }
  async ionViewDidEnter() {
    this.getUserName();
    const loading = await this.loadingCtrl.create({
      message: 'Loading Stories...',
      duration: 2000
    });

    await loading.present();
    this.posts = [];

    this.firebaseService.readPosts().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();
      this.posts = [...this.posts];


      loading.onWillDismiss();
      this.updateSchedule();
    });


  }
  returnKValue(number: number, args?: any): any {
    if (isNaN(number)) return null; // will only work value is a number
    if (number === null) return null;
    if (number === 0) return null;
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 1);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
  }


  async updateSchedule() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading stories...',
      duration: 2000
    });

    await loading.present();

    loading.onWillDismiss();
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.groups = [];
    let categoryObj = {};
    categoryObj['category'] = "Drama";
    categoryObj['icon'] = "../../../assets/icons/theater.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'DRAMA', 'shooting': false });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }


    categoryObj = {};
    categoryObj['category'] = "Adventure";
    categoryObj['icon'] = "../../../assets/icons/mountain.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'ADVENTURE', 'shooting': false });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }

    categoryObj = {};
    categoryObj['category'] = "Crime";
    categoryObj['icon'] = "../../../assets/icons/theater.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'CRIME', 'shooting': false });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }

    categoryObj = {};
    categoryObj['category'] = "Comedy";
    categoryObj['icon'] = "../../../assets/icons/fun.svg";
    categoryObj['posts'] = _.filter(this.posts, { 'generType': 'COMEDY', 'shooting': false });
    if (categoryObj['posts'].length > 0) {
      this.groups.push(categoryObj);
    }

  }
  async presentToast(msg, type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      cssClass: type,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  async approve(obj) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure want to lock this story?',
      buttons: [
        {
          text: 'Ready to shoot',
          cssClass: 'primary',
          handler: async () => {
            console.log('Ready to shoot');
            obj['shooting'] = true;
            this.firebaseService.updatePost(obj['id'], obj);
            const loading = await this.loadingCtrl.create({
              message: 'Updating story...',
              duration: 2000
            });

            await loading.present();

            loading.onWillDismiss();
            this.presentToast('Story ready for shooting', 'toast-success');
            this.callCloudFunction(obj);
            this.ionViewDidEnter();


          }
        },
        {
          text: 'Cancel',
          cssClass: 'danger',
          handler: () => {

            console.log('Cancel');
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }
  async reject(obj) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Would you like to  reject this story?',
      buttons: [
        {
          text: 'ModifyBudget & Approve',
          handler: async () => {

            const alert1 = await this.alertCtrl.create({
              inputs: [
                {
                  label: 'Proposed Budget',
                  value: obj.budget,
                  name: 'proposedBudget',
                  type: 'text'
                }],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                    this.presentToast('Declined for shooting..', 'toast-danger');
                  }
                }, {
                  text: 'Save',
                  handler: async (alertData) => { //takes the data 
                    obj['shooting'] = true;
                    obj['budget'] = alertData.proposedBudget;
                    this.firebaseService.updatePost(obj['id'], obj);
                    const loading = await this.loadingCtrl.create({
                      message: 'Updating story...',
                      duration: 2000
                    });

                    await loading.present();

                    loading.onWillDismiss();
                    this.presentToast('Story ready for shooting', 'toast-success');
                    this.updateSchedule();
                  }
                }
              ]
            });
            await alert1.present();
          }
        },
        {
          text: 'Yes',
          handler: () => {

            console.log('REJECT_YES');
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }


}
