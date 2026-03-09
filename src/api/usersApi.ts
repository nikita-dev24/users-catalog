import type { UsersResponse } from '@/types/user';

const BASE_URL = 'https://dummyjson.com/users';

export const getUsers = async (
  limit: number,
  skip: number,
): Promise<UsersResponse> => {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const searchUsers = async (query: string): Promise<UsersResponse> => {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to search users');
  }

  return response.json();
};