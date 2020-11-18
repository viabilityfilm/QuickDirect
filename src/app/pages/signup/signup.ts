import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user-options';

import { OnInit } from '@angular/core';
import { MenuController, NavController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  loginName: string;
  dbUsers: any[];
  mobile_s: any;

  constructor(private menu: MenuController,
    private navController: NavController,
    private movieService: FireBaseService, private router: Router,
    public toastController: ToastController,
    public userData: UserData, public loading: LoadingController
    , public actionSheetController: ActionSheetController, public confData: ConferenceData) { }
  isLogin: boolean = true;
  mode: string = "signIn";
  email: string = "";
  password: string = "";
  userName: string = "";
  email_s: string = "";
  password_s: string = "";
  userName_s: string = "";
  loadingProgress;
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getUserName();
    this.readUsers();
  }
  getUserName() {
    this.userData.getUsername().then((username) => {
       
    });
  }
  async login() {
    let userObj = new User();
    if (!this.email && !this.password) {
      this.presentToast('Values missing..!', 'toast-danger');
    }
    userObj.emailId = this.email;
    userObj.password = this.password;

    this.loadingProgress = await this.loading.create({
      message: 'Logging in..',
      duration: 2000
    });
    await this.loadingProgress.present();

    this.checkUser(userObj, "signIn");
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    if (ev.detail.value === "signUp") {
      this.isLogin = false;
      this.mode = "signUp";
    } else {
      this.isLogin = true;
      this.mode = "signIn";
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'User Type',
      buttons: [{
        text: 'Director',
        role: 'destructive',
        icon: 'megaphone-outline',
        handler: () => {
          this.createUser('D');
        }
      }, {
        text: 'Producer',
        icon: 'cash-outline',
        handler: () => {
          this.createUser('P');
        }
      }, {
        text: 'Viewer',
        icon: 'chatbubbles-outline',
        handler: () => {
          this.createUser('V');
        }
      }]
    });
    await actionSheet.present();
  }

  checkUser(userObj: User, methodType) {
    let validUser:boolean=false;
    this.dbUsers.forEach(element => {
      if (element['emailId'] === userObj.emailId
        && element['password'] === userObj.password && methodType === "signIn"
      ) {
        this.presentToast('Welcome Back '+element['userName']+"..!", 'toast-success');
        this.userData.login(element['userName'],element['userFlag']);
        this.userData.setUsername(element['userName']);
        this.userData.userName=element['userName'];
        this.userData.email=element['emailId'];
        this.userData.userType=element['userFlag']
        this.userData.userMob=element['mobile'];
        this.router.navigateByUrl('/app/tabs/schedule');
        validUser=true;
        return true;
      } else if (methodType === "signIn" && validUser===false && ((element['emailId'] != userObj.emailId) ||
        element['password'] != userObj.password
      )) {
        this.presentToast('Invalid credentials..!', 'toast-danger');
        return true;
      }


    });




  }

  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      header: msg,
      duration: 1000,
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }
  clearValues() {
    this.userName = '';
    this.password = '';
    this.email = '';
    this.userName_s = '';
    this.password_s = '';
    this.email_s = '';
    this.mobile_s='';
  }

  async signUp() {
    if (!this.email_s && !this.password_s) {
      this.presentToast('Values missing..!', 'toast-danger');
      return;
    } else {
      this.presentActionSheet();
    }

  }

  readUsers() {
    this.dbUsers = [];
    this.movieService.readUsers().subscribe(data => {
      data.map(e => {
        let docData = e.payload.doc.data();
        docData['id'] = e.payload.doc.id;
        this.dbUsers.push(docData);
      });
      this.movieService.userData=this.dbUsers;
    });
  }
  async createUser(userType?) {
    let userObj = {};
    userObj['emailId'] = this.email_s;
    userObj['password'] = this.password_s;
    userObj['userName'] = this.email_s.split('@')[0];
    userObj['mobile']=this.mobile_s;
    userObj['userFlag'] = userType;
    let isExist = false;
    this.dbUsers.forEach(e => {
      if (e.emailId === this.email_s) {
        this.presentToast('User email already exists..!', 'toast-danger')
        isExist = true;
      }
    })
    if (isExist === false) {
      this.loadingProgress = await this.loading.create({
        message: 'Creating user...',
        duration: 2000
      });
      await this.loadingProgress.present();

      this.movieService.createUsers(userObj).then(creationResponse => {
        if (creationResponse != null) {
          this.presentToast('User Created..!', 'toast-success');
          this.loadingProgress.onWillDismiss();
          this.clearValues();
          this.mode = "signIn";
        }
      })
        .catch(error => this.presentToast('Some think went Wrong..!', 'toast-danger'));

    }

  }

  openCustom() {

  }



  // onSignup(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     this.userData.signup(this.signup.username);
  //     this.router.navigateByUrl('/app/tabs/schedule');
  //   }
  // }
}
