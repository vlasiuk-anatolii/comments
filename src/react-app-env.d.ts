/// <reference types="react-scripts" />

export interface User {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  website: string,
  avatar: string,
  createdAt: string,
  updatedAt: string,
}

export interface Post {
  userid: number,
  id: number,
  title: string,
  body: string,
  createdAt: string,
  updatedAt: string,
}

export interface Comment {
  id: number,
  postid: number,
  name: string,
  email: string,
  homepage: string,
  body: string,
  createdAt: string,
  updatedAt: string,
}

export interface RootState {
  posts: Post[];
  users: User[];
  comments: Comment[];
  selectedUserId: string,
  selectedPostId: number | undefined,
  isLoading: boolean,
  posttitle: string,
}

export interface NewComment {
  postid: number | undefined,
  name: string,
  email: string,
  homepage: string,
  body: string,
}
