import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user-options';

import { OnInit } from '@angular/core';
import { MenuController, NavController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { FireBaseService } from '../../services/firebase.service';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {

  constructor(private menu: MenuController,
    private navController: NavController,
    private movieService: FireBaseService, private router: Router,
    public toastController: ToastController,
    public userData: UserData, public loading: LoadingController
    , public actionSheetController: ActionSheetController) { }
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
  async login() {
    let userObj = new User();
    if (!this.email && !this.password) {
      this.presentToast('Values missing..!');
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
    let validateUSer = this.movieService.getUserList();
    let validUserObj;
    validateUSer.snapshotChanges().subscribe(res => {
      if (res != null) {
        let isExist = false;
        let isPasswordSame = false;
        res.forEach(element => {
          if (element.payload.toJSON()['emailId'] === userObj.emailId) {
            isExist = true;
          }
          if (methodType == "signIn") {
            if (element.payload.toJSON()['password'] === userObj.password) {
              isPasswordSame = true;
              validUserObj = element.payload.toJSON();
            }
          }
        });

        if (methodType == "signUp" && !isExist) {
          this.movieService.createUser(userObj).then(creationResponse => {
            if (creationResponse != null) {
              this.presentToast('User created successfully!');
              this.clearValues();
              this.mode = "signIn";
            }
          })
            .catch(error => console.log(error));
        } else if (methodType == "signUp" && isExist) {
          this.presentToast('User email already exists..!')
        } else if (methodType == "signIn" && isExist) {
          if (isPasswordSame == false) {
            this.presentToast('Invalid credentials..!');
          } else {
            this.loadingProgress.onWillDismiss();
            this.presentToast('Login Success..!');
            this.userData.currentLoggedInUser = validUserObj;
            this.userData.login(validUserObj.userName);
            this.userData.setUsername(validUserObj.userName);

            this.router.navigateByUrl('/app/tabs/schedule');
          }
        } else if (methodType == "signIn" && !isExist) {
          this.presentToast('Invalid credentials..!');
        }
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
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
  }

  async signUp() {
    if (!this.email && !this.password && !this.userName) {
      this.presentToast('Values missing..!');
      return;
    }else{
      this.presentActionSheet();
    }
    
  }
  async createUser(userType?){
    let userObj = new User();
    userObj.emailId = this.email_s;
    userObj.password = this.password_s;
    userObj.userName = this.userName_s;
    userObj.userFlag = userType;
    this.checkUser(userObj, "signUp");

    this.loadingProgress = await this.loading.create({
      message: 'Creating user...',
      duration: 2000
    });
    await this.loadingProgress.present();
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
