import UsersList from '@/components/users/users-list';
import { getUsers } from '@/lib/actions/user';
import React from 'react';

const UsersPage = async () => {
  const res = await getUsers();
  return <UsersList users={res.data} />;
};

export default UsersPage;
