import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config, PopoverController } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { LoginPopover } from './login-popup/login-popover';
import { FireBaseService } from '../../services/firebase.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { Platform } from '@ionic/angular';

import { NavigationStart, Event as NavigationEvent } from '@angular/router';
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = ['Most Viewed - Stories', 'Top Budget - Stories', 'Top Actors', 'Top Actress'];
  confDate: string;
  showSearchbar: boolean;
  slideOpts;
  posts: any[];
  topBudget: any[];
  topViewed: any[];
  username: string;
  actors: any = [];
  topActress: any = [];
  topActors: any = [];
  userType: string;
  changeTool: string = 'change-tool-height2';

  constructor(
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config,
    public fireBaseService: FireBaseService,
    public platForm: Platform
  ) {


    const slideOpts = {
      slidesPerView: 2,
      coverflowEffect: {
        rotate: 50,
        stretch: 25,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },

    }

    this.slideOpts = slideOpts;
    this.platForm.backButton.subscribeWithPriority(10, async () => {

      
      const alert = await this.alertCtrl.create({
        header: 'Confirm',
        message: 'Do you really want to exit?',
        buttons: [
          {
            text: 'No',
            handler: () => {


            }
          },
          {
            text: 'Yes',
            handler: () => {
              // they want to remove this session from their favorites
              navigator['app'].exitApp();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      await alert.present();

    });


    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationStart) {
            this.getUserName();
          }
        });
  }

  ionViewDidEnter() {
    this.getUserName();
    this.getPosts();


  }

  getUserName() {
    setTimeout(() => {
      this.user.getUsername().then((username) => {
        this.username = username;
        
        if (this.username != null) {
          this.changeTool = 'change-tool-height1';
          this.userType = this.user.userType;
        } else {
          this.changeTool = 'change-tool-height2';
        }
      });
    }, 200);
  }
  showDetail(data) {
    this.confData.actorData = data;
    if (this.loginCheck()) {
      this.router.navigateByUrl('/actor-details');
    }
  }

  ngOnInit() {

    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }
  goToDetail(arg) {
    this.confData.routingData = arg;
    this.confData.isFromPage = 'dashboard';
    this.confData.loginUser = this.username;
    if (this.loginCheck()) {
      this.router.navigateByUrl('/app/tabs/speakers/speaker-details');
    }
  }
  /***
    * getPosts
    */
  async getPosts() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading Stories...',
      duration: 2000
    });

    await loading.present();
    this.posts = [];
    this.topBudget = [];
    this.topViewed = [];
    this.fireBaseService.readPosts().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.posts.push(docData);
      });
      this.posts.reverse();
      this.posts = [...this.posts];
      this.topBudget = _.orderBy(this.posts, ['budget'], ['desc']);
      this.topViewed = _.orderBy(this.posts, ['views'], ['desc']);
      this.fireBaseService.postData = this.posts;
      loading.onWillDismiss();
    });
    this.actors = [];
    this.topActors = [];
    this.topActress = [];
    this.fireBaseService.readActors().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.actors.push(docData);
      });

      let actors = _.filter(this.actors, { 'gender': 'M' });
      let actoress = _.filter(this.actors, { 'gender': 'F' })

      actors.sort(function (a, b) {
        var nameA = a.associatedStories.length;
        var nameB = b.associatedStories.length;
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
      actoress.sort(function (a, b) {
        var nameA = a.associatedStories.length;
        var nameB = b.associatedStories.length;
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });

      this.topActors = actors ? actors.splice(0, 2) : actors;
      this.topActress = actoress ? actoress.splice(0, 2) : actoress;



      loading.onWillDismiss();
    });
  }
  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;

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
  createPost() {
    if (this.loginCheck()) {
      this.router.navigateByUrl('/create-post');
    }
  }
  openPostList() {

    this.router.navigateByUrl('/post-list');

  }
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: LoginPopover,
      event
    });
    await popover.present();
  }
  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }




}
