import { BASE_URL } from './api';

export async function getComments(postId: number | undefined) {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function delComment(id : number) {
  const response = await fetch(`${BASE_URL}/comments/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response;
}

export async function postComment(
  postid: number | undefined,
  name : string,
  email : string,
  homepage: string,
  body : string,
) {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      postid,
      name,
      email,
      homepage,
      body,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response;
}
