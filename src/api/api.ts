/* eslint-disable no-console */
export const BASE_URL = 'http://3.252.200.218:5000';

export async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}
