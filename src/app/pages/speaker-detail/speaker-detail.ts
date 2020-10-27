import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConferenceData } from '../../providers/conference-data';
import { ActionSheetController, LoadingController, ToastController, IonButton, AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as moment from 'moment';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import { ModalController } from '@ionic/angular';
import { ActorAddPage } from '../../modals/actor-add/actor-add.page';
import * as _ from "lodash";
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
})
export class SpeakerDetailPage {
  speaker: any;
  @ViewChild('ref', { static: false }) pRef: IonButton;
  @ViewChild('ref2', { static: false }) pRef1: IonButton;
  postData: any;
  showPost: boolean = false;
  defaultHref: string = "/app/tabs/speakers";
  p_bar_value1: number;
  p_bar_value2: number;
  liked: boolean = false;
  mode: string = "story";
  heartClass: string;
  username: string;
  showActor: string;
  hasActor: boolean = false;
  dataReturned: any;
  userExist: boolean = false;
  showprice: boolean = false;
  actor_img: string = "";
  actress_img: any = "";
  isLoaded: boolean = false;
  budget: number;
  dummyData = [
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    }
  ];
  fundType: any;
  showFundDetails: boolean = true;
  userType: string;
  showFinalPriceonSave: boolean = false;
  constructor(
    private dataProvider: ConferenceData,
    private route: ActivatedRoute,
    public router: Router,
    public toastController: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    public firebaseService: FireBaseService,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private http: HttpClient
  ) {

  }
  segmentChanged(obj) {

  }
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1300);
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
      this.username = username;
      if(this.username==undefined){
        this.username=this.userData.userName;
      }
      this.loginCheck();
    });
    
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
  showPriceField() {
    this.showprice = true;
  }
  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: type,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  async updatePrice() {
    let alreadyFunded = false;
    this.postData['fundedBy'].forEach(element => {
      if (element.split('_')[0] === this.username) {
        this.presentToast('Already Funded..', 'toast-danger');
        alreadyFunded = true;
        return false;
      }
    });
    if (alreadyFunded) {
      return false;
    }
    if (this.postData['fundType'] == 1) {
      this.postData['budget'] = this.budget;
    }
    let temPostData=this.postData;
    this.postData['fundedBy'].push(this.username + '_' + this.budget);
    let totalCrowdFund = 0;
    this.postData['fundedBy'].forEach(element => {
      if (element.split('_')[1] != undefined) {
        totalCrowdFund += Number(element.split('_')[1]);
      }
    });
    if (this.postData['fundType'] == 2) {
      if (this.postData['budget'] <= totalCrowdFund) {
        this.presentToast('Fund limit reached - Story to Shooting-InProgress', 'toast-success');
        if (this.username!='') {
          let emailUrl = "https://us-central1-app-direct-a02bf.cloudfunctions.net/sendMail?dest=" + this.userData.email;
          emailUrl = emailUrl + '&body=' + this.username.toUpperCase() + ' Shown interest on your story <br> Story is moved to READY TO SHOOT Queue<br> For more details contact @,  Email -' + this.userData.email + ' Mob -' + this.userData.userMob
          this.callService(emailUrl);
        }
        this.pRef['el']['hidden'] = true;
        this.showFinalPriceonSave = true;
        this.showprice = false;
        temPostData['shooting']=true;
        this.firebaseService.updatePost(this.postData['id'], temPostData);
        return;
      }else if(this.postData['budget']>=totalCrowdFund){
        this.showPopupForRemainigAmount(totalCrowdFund);
      }
    }

    this.firebaseService.updatePost(this.postData['id'], this.postData);
    const loading = await this.loadingCtrl.create({
      message: 'Updating Budget...',
      duration: 3000
    });

    await loading.present();

    loading.onWillDismiss();
    this.pRef['el']['hidden'] = true;
    this.showFinalPriceonSave = true;
    this.showprice = false;
    this.budget = 0;
    this.presentToast('Fund Details Updated', 'toast-success');

  }
  async showPopupForRemainigAmount(total) {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: 'Your contribution added. Remaining '+Number(this.postData['budget']-total),
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
          handler: async () => {
           console.log('contr msg'); 
          }
        }
      ]
    });
    await alert.present();
  }

  getStatus(obj) {
    if (obj['likes'].indexOf(this.username) >= 0) {
      return true;
    } else {
      return false;
    }
  }


  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100)

      this.p_bar_value1 = apc;
      this.p_bar_value2 = apc;
    }, 30 * i);
  }

  changeClass(obj) {
    let notify={};
    if (obj['likes'] && obj['likes'].indexOf(this.username) >= 0) {
      let idx = obj['likes'].indexOf(this.username);
      obj['likes'].splice(idx, 1);
      this.heartClass = "heart-cls-white";
      notify['type'] = 'disliked';
    } else if (obj['likes'] && obj['likes'].indexOf(this.username) < 0) {
      obj['likes'].push(this.username);
      this.heartClass = "heart-cls-red";
      notify['type'] = 'liked';
    }
    if (obj['likes'].indexOf(undefined) >= 0) {
      obj['likes'].splice(obj['likes'].indexOf(undefined), 1);
    }
    this.firebaseService.updatePost(obj['id'], obj);
 
    
     
    notify['uploadedBy'] = this.username;
    notify['updateOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    notify['type'] = 'like';
    notify['title']=obj['title'];
     
    this.firebaseService.createNotify(notify).then(creationResponse => {
      if (creationResponse != null) {
       
      }
    })
      .catch(error => this.presentToast('Some think went Wrong..!','toast-danger'));
  }
  setClass(obj) {
    if (obj['likes'] && obj['likes'].indexOf(this.username) >= 0) {
      this.heartClass = "heart-cls-red";
    } else if (obj['likes'] && obj['likes'].indexOf(this.username) < 0) {
      obj['likes'].push(this.username);
      this.heartClass = "heart-cls-white";
    }
  }
  checkActor(data) {
    if (data['actors'] && data['actress'] && data['actors'].length == 0 && data['actress'].length == 0) {
      this.hasActor = false;
    } else {
      this.userExist = false;
      if (data['actors'] && data['actress']) {
        data['actors'].forEach(element => {
          if (element && element.split('_')[1] && element.split('_')[1].indexOf(this.username) >= 0) {
            this.userExist = true;
          }
        });
      }
      this.hasActor = true;
    }
  }
  checkActorAssociations(arg) {
    let ass_actorList = [];

    let ass_actressList = [];
    arg['actors'].forEach(element => {
      if (element && element.split('_')[0]) {
        ass_actorList.push(element.split('_')[0]);
      }
    });
    arg['actress'].forEach(element => {
      if (element && element.split('_')[0]) {
        ass_actressList.push(element.split('_')[0]);
      }
    });
    let actorCount = this.confData.compressArray(ass_actorList);
    let actressCount = this.confData.compressArray(ass_actressList);
    let actorId;
    let actressId;
    actorId = _.maxBy(actorCount, function (o) { return o.count; });
    actressId = _.maxBy(actressCount, function (o) { return o.count; });
    this.firebaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        if (actorId && docData['id'] === actorId.value) {
          this.actor_img = docData['image'];
        }
        if (actressId && docData['id'] === actressId.value) {
          this.actress_img = docData['image'];
        }
      });
    });
  }
  async addActor(data) {

    const modal = await this.modalController.create({
      component: ActorAddPage,
      componentProps: {
        "paramID": this.postData,
        "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.checkActor(this.dataReturned);
        this.actor_img=this.userData.actor_img!=''?this.userData.actor_img:'';
        this.actress_img=this.userData.actoress_img!=''?this.userData.actoress_img:'';
        this.presentToast('Your choices is saved..!', 'toast-info');
      }
    });

    return await modal.present();
  }
  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  ionViewWillEnter(arg?) {
    
    if (arg == null && this.confData.isFromPage == '') {
      this.router.navigateByUrl("/app/tabs/speakers");
    }
    this.showFinalPriceonSave = false;
    this.showFundDetails = true;
    this.showSkeltonLoading();
    this.getUserName();
    this.username = this.confData.loginUser;
    this.userType = this.userData.userType;
    this.postData = this.confData.routingData;
    this.postData['fundedBy'].forEach(element => {
      if (element.split('_')[0] === this.username) {
        this.showFundDetails = false;
        this.budget = this.postData.budget;
        this.showFinalPriceonSave = true;
      }
    });

    this.setClass(this.postData);
    this.checkActor(this.postData);
    this.fundType = this.postData.fundType;
    this.checkActorAssociations(this.postData);
    this.showPost = true;
    let isFrom = this.confData.isFromPage;
    if (isFrom == 'dashboard') {
      this.defaultHref = '/app/tabs/schedule';
    } else {
      this.defaultHref = "/app/tabs/speakers";
    }
    this.confData.routingData = {};

  }
  ionViewDidLeave() {
    this.confData.isFromPage = '';
  }
  ngAfterViewInit() {


  }
  back() {

  }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  openExternalUrl(url: string) {
    this.inAppBrowser.create(
      url,
      '_blank'
    );
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(speaker: any) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

}

