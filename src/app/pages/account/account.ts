import { AfterViewInit, Component } from '@angular/core';
 

import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { Router } from '@angular/router';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage {
  username: string;
  speakers: any[] = [];
  generType: string = "actor";
  segment = "actor";
  posts: any[];
  
  dramaStories: any;
  comedyStories: any;
  advStories: any;
  crimeStories: any;
  isLoaded: boolean = false;
  liked: boolean = false;
  heartClass: string;
  defaultHref = '/app/tabs/schedule';
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
    },
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
    },
    {
      synopsis: "1",
      title: "1",
      imaage: "",
      generType: "1",
      uploadedBy: "1",
      uploadedOn: "1"
    },
  ]
 
  excludeTracks: any;
  users: any=[];
  maleActor: any=[];
  femaleActor: any=[];
  constructor(public confData: ConferenceData,
    public router: Router,public routerOutlet: IonRouterOutlet,
    public userData: UserData,public modalController: ModalController,
    private callNumber: CallNumber,
    public fireBaseService: FireBaseService,public _sanitizer:DomSanitizer
  ) { }

 
  updatePicture() {
    console.log('Clicked to update picture');
  }
  ionViewDidEnter() {
    
    this.isLoaded=false;
    this.getUserName();
    this.getPosts();
    this.showSkeltonLoading();
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
      this.username = username;
      this.loginCheck();
    });
  }
  loginCheck() {
    if (_.isEmpty(this.username)) {
      this.router.navigateByUrl('/signUp');
      return false;
    } else {
      return true;
    }
  }
  changeCategory(ev) {
    this.generType = ev.detail.value;
    this.isLoaded = false;
    this.showSkeltonLoading();
  }

  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }
  async getPosts() {


    this.posts = [];
    this.dramaStories = [];
    this.comedyStories = [];
    this.advStories = [];
    this.crimeStories = [];
    this.fireBaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        docData['storyCount']=e.payload.doc.data()['associatedStories'].length;
        let profile=e.payload.doc.data()['profiles']?e.payload.doc.data()['profiles'].split('=')[1]:e.payload.doc.data()['profiles'];
        if(profile==undefined){
          profile=e.payload.doc.data()['profiles']?e.payload.doc.data()['profiles'].split('/')[3]:e.payload.doc.data()['profiles'];
        }
        docData['thumnail']=this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);
        this.users.push(docData);
      });

       
      this.maleActor=_.filter(this.users, { 'gender': 'M' });
      this.maleActor = _.orderBy(this.maleActor, ['storyCount'], ['desc']);
       
      
      this.femaleActor=_.filter(this.users, { 'gender': 'F' });
      this.femaleActor = _.orderBy(this.femaleActor, ['storyCount'], ['desc']);
     
    });
    
  }
  showdialer(data){
    this.callNumber.callNumber(data, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  goBack(){
    this.router.navigateByUrl('/app/tabs/speakers');
  }
}
