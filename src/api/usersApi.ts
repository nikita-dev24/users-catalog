// src/api/usersApi.ts
import type { UsersResponse } from '@/types/user';

const BASE_URL = 'https://dummyjson.com/users';

export const getUsers = async (
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<UsersResponse> => {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const searchUsers = async (
  query: string,
  signal?: AbortSignal,
): Promise<UsersResponse> => {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error('Failed to search users');
  }

  return response.json();
};