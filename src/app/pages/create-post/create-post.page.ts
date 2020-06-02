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
  providers:[AngularFirestore]
})

export class CreatePostPage implements OnInit {
  selectOptions = {
    header: 'Select a range'
  };
  text: string = "";
  posts = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;
  synopsis: string = "";
  username: string;
  loadingProgress;
 // Upload Task 
 task: AngularFireUploadTask;

 // Progress in percentage
 percentage: Observable<number>;

 // Snapshot of uploading file
 snapshot: Observable<any>;

 // Uploaded File URL
 UploadedFileURL: Observable<string>;

 //Uploaded Image List
 images: Observable<MyData[]>;

 //File details  
 fileName:string;
 fileSize:number;

 //Status check 
 isUploading:boolean;
 isUploaded:boolean;

 private imageCollection: AngularFirestoreCollection<MyData>;


  @ViewChild('ref', {static: false}) pRef: IonInput;
  constructor(public navCtrl: NavController,

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router:Router,
    private fireBaseService: FireBaseService, public userData: UserData,
    public actionSheetController: ActionSheetController,private storage: AngularFireStorage, private database: AngularFirestore
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

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  clearValues() {
    this.synopsis = "";
  }
 logout(){
  this.router.navigateByUrl('/app/tabs/schedule');
 }
  async post(genre) {
    if (this.synopsis == '') {
      this.presentToast('Please provide synopsis..!');
      return true;
    }
    let postObj = new Post();
    postObj.synopsis = this.synopsis;
    postObj.uploadedBy = this.username;
    postObj.uploadedOn = moment().format('YYYY-MM-DD hh:mm:ss A').toString();
    postObj.generType = genre;
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Uploading your post..',
      duration: 2000
    });
    await this.loadingProgress.present();
    this.fireBaseService.createPost(postObj).then(creationResponse => {
      if (creationResponse != null) {
        this.presentToast('Posted successfully!');
        this.loadingProgress.onWillDismiss();
        this.clearValues();
      }
    })
      .catch(error => this.presentToast('Some think went Wrong..!'));


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
  uploadFile(event: FileList) {
    

    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `storyThumnails/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
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
