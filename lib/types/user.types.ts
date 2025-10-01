export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
}

export interface User {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  role: UserRoles;
  profileImageUrl?: string;
  passwordGenerated: boolean;
  password?: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  username: string;
  firstname: string;
  lastname: string;
  role: UserRoles;
  profileImageUrl?: string;
}
