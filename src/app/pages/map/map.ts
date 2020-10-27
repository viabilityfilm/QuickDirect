import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { UserData } from '../../providers/user-data';
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage {
  speakers: any[] = [];
  generType: string = "drama";
  segment = "drama";
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
  username: string;
  constructor(public confData: ConferenceData, 
    public router: Router, 
    public userData:UserData,
    public fireBaseService: FireBaseService) { }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
  }
  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
    this.getUserName();
    this.getPosts();
    this.showSkeltonLoading();
  }
   
  getUserName() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 800);
  }

  navigateToDetalil(obj){
    if(obj['views']!=undefined){
      obj['views']=obj['views']+1;
    }
    this.fireBaseService.updatePost(obj['id'],obj);
    this.confData.routingData=obj;
    this.confData.isFromPage='category';
    this.confData.loginUser=this.username;
    this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
  }
  async getPosts() {


    this.posts = [];
    this.dramaStories= [];
    this.comedyStories= [];
    this.advStories= [];
    this.crimeStories= [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map(e => {
        let docData=e.payload.doc.data();
        docData['id']=e.payload.doc.id;
        if(docData['likes'] && docData['likes'].indexOf(this.username)>=0){
          this.posts.push(docData);
        }
      });
      this.posts.reverse();
      this.posts = [...this.posts];
      this.dramaStories = _.filter(this.posts, { 'generType': 'DRAMA' });
      this.comedyStories = _.filter(this.posts, { 'generType': 'COMEDY' });
      this.advStories = _.filter(this.posts, { 'generType': 'ADVENTURE' });
      this.crimeStories = _.filter(this.posts, { 'generType': 'CRIME' });  
    });
  }
  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  getStatus(obj){
    if(obj['likes'].indexOf(this.username)>=0){
      return true;
    }else{
      return false;
    }
  }
  changeClass(obj) {
    if (this.liked == true) {
      this.liked = false;
      this.heartClass = "heart-cls-white";
      if(obj['likes'].indexOf(this.username)>0){
        let idx=obj['likes'].indexOf(this.username);
        obj['likes'].splice(idx,1);
      }
    } else {
      this.liked = true;
      this.heartClass = "heart-cls-red";
      if(obj['likes'].indexOf(this.username)<=0){
        obj['likes'].push(this.username);
      }
    }
    this.fireBaseService.updatePost(obj['id'],obj);
  }
  changeCategory(ev) {
    this.generType=ev.detail.value;
    this.isLoaded=false;
    this.showSkeltonLoading();
  }
}
 