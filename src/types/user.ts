export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  email: string;
  image: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}