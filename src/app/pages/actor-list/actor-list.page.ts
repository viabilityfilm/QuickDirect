import { Component, ViewChild,ElementRef,OnInit } from '@angular/core';
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
import { GoogleChartInterface } from 'ng2-google-charts';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.page.html',
  styleUrls: ['./actor-list.page.scss'],
})
export class ActorListPage implements OnInit {
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
 
 
  constructor( public confData: ConferenceData,
    public router: Router,
    public userData: UserData,
    public fireBaseService: FireBaseService) { }
  ngOnInit(): void {
    
  }

    
  }
  