export const BASE_URL = 'http://127.0.0.1:5000';

export async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}
