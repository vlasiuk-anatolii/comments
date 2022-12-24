/* eslint-disable no-console */
import { Post } from '../react-app-env.d';
import { BASE_URL } from './api';
// const BASE_URL = 'http://3.252.200.218:5000';

export async function getPosts(userId: string): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getPostbyId(postId:number) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getAllPosts() {
  const response = await fetch(`${BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function deletePost(id : number) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response;
}
