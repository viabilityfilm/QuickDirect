import { Injectable } from '@angular/core';
import { User, Post } from '../interfaces/user-options';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AngularFireStorageModule, AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  userList: AngularFireList<any>;
  user: AngularFireObject<any>;
  childEvents = new Subject();
  playersRef = this.db.database.ref("users/");
  postRef = this.db.database.ref("posts/")
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  constructor(private db: AngularFireDatabase,
    private toastCtrl: ToastController,private afStorage: AngularFireStorage) {



  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
  }

  createPost(post: Post) {
    this.postRef = this.db.database.ref("posts/");

    return this.postRef.push({
      synopsis: post.synopsis,
      generType: post.generType,
      uploadedBy: post.uploadedBy,
      uploadedOn: post.uploadedOn
    })
  }
  uploadFile(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
  }

  // Create
  createUser(apt: User) {
    this.playersRef = this.db.database.ref("users/");
    return this.playersRef.push({
      userName: apt.userName,
      emailId: apt.emailId,
      password: apt.password,
      userFlag: apt.userFlag
    })
  }


  // Get Single
  getSelectedUsers(id: string) {
    this.user = this.db.object('/users/' + id);

    return this.user;
  }
  fetchPost() {
     
    var postRef = this.db.database.ref("/posts");
     
  
    return postRef;
  }
  // Get List
  getUserList() {
    this.userList = this.db.list('/users');
    return this.userList;
  }


  // Update
  updateBooking(id, apt: User) {
    return this.user.update({
      userName: apt.userName,
      emailId: apt.emailId,
      password: apt.password,
    })
  }

  // Delete
  deleteBooking(id: string) {
    this.user = this.db.object('/users/' + id);
    this.user.remove();
  }
}
