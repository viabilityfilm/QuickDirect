
export interface UserOptions {
  username: string;
  password: string;
}
export class User {
  userName: string;
  password: string;
  emailId:string;
  userFlag:string;
}
export class Post{
  synopsis:string;
  generType:string;
  uploadedBy:string;
  uploadedOn:string;
  image:string;
  storyId:string;
  comments:[];
  likes:[];
}

