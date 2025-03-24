import { Photo } from "../tour/photo";

export interface IPost {
  id: number;
  content: string;
  user: number;
  time: number;
  likes: number[];
  photos: Photo[];
}

export type PostCard = Post & {
  username: string;
}

export class Post implements IPost {
  id: number;
  title: string;
  content: string;
  linkedChannel: number;
  user: number;
  time: number;
  likes: number[];
  photos: Photo[];
  isSticky: boolean;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.title = data.title ?? '新帖子';
    this.content = data.content ?? '';
    this.linkedChannel = data.linkedChannel ?? -1;
    this.user = data.user ?? -1;
    this.time = data.time ?? Date.now();
    this.likes = data.likes ?? [];
    this.photos = data.photos ? data.photos.map((photo: any) => new Photo(photo)) : [];
    this.isSticky = data.isSticky ?? false;
  }
}

export class Comment implements IPost {
  id: number;
  content: string;
  user: number;
  time: number;
  likes: number[];
  photos: Photo[];
  linkedPost: number;
  parentComment: number;
  constructor(data: any) {
    this.id = data.id ?? -1;
    this.content = data.content ?? '';
    this.user = data.user ?? -1;
    this.time = data.time ?? Date.now();
    this.likes = data.likes ?? [];
    this.photos = data.photos ? data.photos.map((photo: any) => new Photo(photo)) : [];
    this.linkedPost = data.linkedPost ?? -1;
    this.parentComment = data.parentComment ?? -1;
  }
}

export type StructedComment = Comment & {
  userName: string;
  userGroup: string;
  timeStr: string;
  replies: StructedComment[];
};