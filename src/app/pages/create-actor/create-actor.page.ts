import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, IonInput } from '@ionic/angular';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FireBaseService } from '../../services/firebase.service';
import { Post, Actor } from '../../interfaces/user-options';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import _ from 'lodash';
export interface ActorData {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-create-actor',
  templateUrl: './create-actor.page.html',
  styleUrls: ['./create-actor.page.scss'],
  providers: [AngularFirestore]
})
export class CreateActorPage implements OnInit {
 
  name:string="";
  gender:boolean=false;
  mobile:string="";
  skills:string="";
  url:string="";
  profiles="";
  
  task: AngularFireUploadTask;

   
  percentage: Observable<number>;

   
  snapshot: Observable<any>;

   
  UploadedFileURL: Observable<string>;

   
  images: Observable<ActorData[]>;

   
  fileName: string;
  fileSize: number;

   
  isUploading: boolean;
  isUploaded: boolean;
  UploadedFilePath:string="../../../assets/icons/actor-color.svg";
  private imageCollection: AngularFirestoreCollection<ActorData>;
  loadingProgress: HTMLIonLoadingElement;
   


  constructor( public navCtrl: NavController,

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController, private storage: AngularFireStorage, private database: AngularFirestore
  ) { }
   

  onChange(val){
     
  }
  async presentToast(msg,type) {
    const toast = await this.toastCtrl.create({
      message: msg,
      animated:true,
      cssClass:type,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
  }

  ngOnInit() {
  }
/***
   * uploadFile
   */
  async uploadFile(event: FileList) {


     
    const file = event.item(0)

     
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading Thumbnail..',
      duration: 2000
    });
    await this.loadingProgress.present();
    this.fileName = file.name;

    // The storage path
    const path = `actorThumbnails/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'app-direct' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
    this.task.percentageChanges().subscribe(res => {
      if (res === 100) {
        this.presentToast('Thumbnail uploaded..!','toast-success');
        this.isUploaded = true;
        this.loadingProgress.onWillDismiss();
        this.UploadedFileURL = fileRef.getDownloadURL();
        this.UploadedFileURL.subscribe(resp => {
          this.UploadedFilePath=resp;
          
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
        });
      }
    });
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
     
  }

  addImagetoDB(image: ActorData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
  /***
   * 
   */
  async createActor() {
    if (_.isEmpty(this.name) || _.isEmpty(this.skills)) {
      this.presentToast('Please provide valid input..!','toast-danger');
      return true;
    }
    if(this.isUploaded==false){
      this.presentToast('Upload your Avathar','toast-danger');
      return true;
    }
    
     
    let actorObj ={};
    actorObj['actorName'] = this.name;
    actorObj['gender'] = this.gender===true?'F':'M';
    actorObj['createdOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    actorObj['skills']= this.skills;
    actorObj['image']=this.UploadedFilePath;
    actorObj['associatedStories']=0;
    actorObj['mobile']=this.mobile;
    actorObj['profiles']=this.profiles;
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading your post..',
      duration: 2000
    });
    let actorType;
    await this.loadingProgress.present();
    this.fireBaseService.createActors(actorObj).then(creationResponse => {
      if (creationResponse != null) {
        if(this.gender==false)actorType='Actor';else actorType='Actress';
        this.presentToast(actorType+' created successfully!','toast-success');
        this.loadingProgress.onWillDismiss();
        this.clearValues();
      }
    })
      .catch(error => this.presentToast('Some think went Wrong..!','toast-danger'));
  
  }
  clearValues() {
    this.name='';
    this.skills='';
    this.profiles='';
    this.UploadedFilePath='../../../assets/icons/actor-color.svg';
    this.mobile='';
    
  }



}
