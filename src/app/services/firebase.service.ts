import { Injectable } from '@angular/core';
import { User, Post, Actor } from '../interfaces/user-options';
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
  posts:AngularFireObject<any>;
  childEvents = new Subject();
  postData:any={}
  playersRef = this.db.database.ref("users/");
  postRef = this.db.database.ref("posts/");
  actorRef = this.db.database.ref("actors/");
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  constructor(private db: AngularFireDatabase,private firestore: AngularFirestore,
    private toastCtrl: ToastController,private afStorage: AngularFireStorage) {



  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
  }
  createPost(record) {
    return this.firestore.collection('posts').add(record);
  }
  deletePost(postId) {
    this.firestore.doc('posts/' + postId).delete();
  }
  readPosts() {
    return this.firestore.collection('posts').snapshotChanges();
  }
  updatePost(recordID,record){
    this.firestore.doc('posts/' + recordID).update(record);
  }
  createActors(record){
    return this.firestore.collection('actors').add(record);
  }
  createUsers(record){
    return this.firestore.collection('users').add(record);
  }
  readUsers(){
    return this.firestore.collection('users').snapshotChanges();
  }
  readActors() {
    return this.firestore.collection('actors').snapshotChanges();
  }
  updateActros(recordID,record){
    this.firestore.doc('actors/' + recordID).update(record);
  }
  createActor(actor:Actor){
    this.actorRef = this.db.database.ref("actors/");

    return this.actorRef.push({
      actorName:actor.actorName,
      gender:actor.gender,
      mobile:actor.mobile,
      skills:actor.skills,
      profiles:actor.profiles,
      image:actor.image,
      createdOn:actor.createdOn,
      associatedStories:actor.associatedStories,
      id:Math.floor((Math.random() * 100000000) + 1),
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
      userFlag: apt.userFlag,
      id:Math.floor((Math.random() * 100000000) + 1),
    })
  }


  // Get Single
  getSelectedUsers(id: string) {
    this.user = this.db.object('/users/' + id);

    return this.user;
  }
  // Get Single
  getSelectedPost(id: string) {
    this.posts = this.db.object('/posts/' + id);

    return this.user;
  }
  fetchPost() {
     
    var postRef = this.db.database.ref("/posts");
     
  
    return postRef;
  }
  read_Students() {
    return this.firestore.collection('Students').snapshotChanges();
  }
  create_NewStudent(record) {
    return this.firestore.collection('Students').add(record);
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
