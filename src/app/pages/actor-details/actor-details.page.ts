import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ConferenceData } from '../../providers/conference-data';
import { FireBaseService } from '../../services/firebase.service';
@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.page.html',
  styleUrls: ['./actor-details.page.scss'],
})
export class ActorDetailsPage implements OnInit {
  safeURL: any;
  actorData: any;
  p_bar_value1: number;
  postData:any={};
  isLoaded:boolean=false;
  associatedStories=[];
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
  constructor(public router:Router, 
    private youtube: YoutubeVideoPlayer,
    private confData:ConferenceData,
    private firebase:FireBaseService,
    private _sanitizer: DomSanitizer) { 
    
  }
  ngOnInit(){
    this.actorData=this.confData.actorData;
  }
  ionViewDidEnter() {
    this.actorData=this.confData.actorData;
    this.postData=this.firebase.postData;
    let profile=this.actorData.profiles?this.actorData.profiles.split('=')[1]:this.actorData.profiles;
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+profile);
    this.runDeterminateProgress();
    this.filterStories();
    this.showSkeltonLoading();
  }
  filterStories(){
    this.postData.forEach(element => {
       if(this.actorData['associatedStories'].indexOf(element['id'])>=0){
          this.associatedStories.push(element);
       }
    });
  }
  showSkeltonLoading() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }
  runDeterminateProgress() {
    
    for (let index = 0; index <= 100; index++) {
      this.setPercentBar(+index);
    }
  }

  setPercentBar(i) {
    setTimeout(() => {
      let apc = (i / 100)
    
      this.p_bar_value1 = apc;
      
    }, 30 * i);
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
    this.actorData={};
  }
  
}
