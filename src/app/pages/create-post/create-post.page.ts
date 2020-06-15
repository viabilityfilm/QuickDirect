import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController, AlertController, ModalController, IonInput } from '@ionic/angular';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FireBaseService } from '../../services/firebase.service';
import { Post } from '../../interfaces/user-options';
import { UserData } from '../../providers/user-data';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  providers: [AngularFirestore]
})

export class CreatePostPage implements OnInit {
  selectOptions = {
    header: 'Select a range'
  };
  text: string = "";
  posts = [];
  title:string="";
  budget:string="";
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;
  synopsis: string = "";
  username: string;
  loadingProgress;
  
  task: AngularFireUploadTask;

   
  percentage: Observable<number>;

   
  snapshot: Observable<any>;

   
  UploadedFileURL: Observable<string>;

   
  images: Observable<MyData[]>;

   
  fileName: string;
  fileSize: number;

   
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;


  @ViewChild('ref', { static: false }) pRef: IonInput;
  UploadedFilePath: string;
  constructor(public navCtrl: NavController,

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController, private storage: AngularFireStorage, private database: AngularFirestore
  ) {
    this.isUploading = false;
    this.isUploaded = false;

    this.imageCollection = database.collection<MyData>('storyThumnails');
    this.images = this.imageCollection.valueChanges()
  }

  ngAfterViewInit() {
    this.getUsername();
    //setTimeout(() => this.pRef.setFocus(), 300);

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
      this.getPosts();

      let query = this.fireBaseService.fetchPost();
      query.orderByChild('uploadedBy').equalTo(this.username).on("child_added", snap => {
        this.posts.push(snap.val());
        this.posts.reverse();
        this.posts = [...this.posts];
      });
    });

  }
  ngOnInit() {






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
  clearValues() {
    this.synopsis = "";
    this.title="";
    this.budget="";
    this.isUploaded=false;
  }
  logout() {
    this.router.navigateByUrl('/app/tabs/schedule');
  }
  async post(genre) {
    if (this.synopsis == '' && this.title=='') {
      this.presentToast('Please provide synopsis..!','toast-danger');
      return true;
    }
    if(this.UploadedFileURL===undefined){
      this.presentToast('Please upload thumbnail..!','toast-danger');
      return true;
    }
    if (this.budget=="") {
      this.presentToast('Please provide budget..!','toast-danger');
      return true;
    }
     
    let postObj={};
    postObj['synopsis'] = this.synopsis;
    postObj['uploadedBy'] = this.username;
    postObj['uploadedOn'] = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    postObj['generType'] = genre;
    postObj['title']=this.title;
    postObj['budget']=this.budget;
    postObj['image']=this.UploadedFilePath;
    postObj['likes']=[];
    postObj['views']=0;
    postObj['actors']=[];
    postObj['actress']=[];
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading your post..',
      duration: 2000
    });
    await this.loadingProgress.present();
     
    this.fireBaseService.createPost(postObj).then(creationResponse => {
      if (creationResponse != null) {
        this.presentToast('Posted successfully!','toast-success');
        this.loadingProgress.onWillDismiss();
        this.clearValues();
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    })
      .catch(error => this.presentToast('Some think went Wrong..!','toast-danger'));


  }
  /***
   * getPosts
   */
  getPosts() {
    this.posts = [];
    let query = this.fireBaseService.fetchPost();
    let postArray = [];

    query.orderByChild('uploadedBy').equalTo(this.username).once('value').then(snapshot => {
      snapshot.forEach(function (data) {
        postArray.push(data.val());
      });
    })

    this.posts = postArray;

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
    const path = `storyThumnails/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Quick Direct Image Upload Demo' };

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

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }



  /**
   * present
   */
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Genres',
      buttons: [{
        text: 'Drama',
        role: 'destructive',
        icon: 'people-circle-outline',
        handler: () => {
          this.post('DRAMA');
        }
      }, {
        text: 'Comedy',
        icon: 'happy-outline',
        handler: () => {
          this.post('COMEDY');
        }
      }, {
        text: 'Adventure',
        icon: 'film-outline',
        handler: () => {
          this.post('ADVENTURE');
        }
      }, {
        text: 'Crime',
        icon: 'skull-outline',
        handler: () => {
          this.post('CRIME');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.post('DRAMA');
        }
      }]
    });
    await actionSheet.present();
  }

}
