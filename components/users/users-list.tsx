'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserFormDialog } from '@/components/users/user-form-dialog';
import type { User } from '@/lib/types/user.types';
import { useAuth } from '@/contexts/auth-context';
import { UsersTable } from '@/components/users/user-table';

export default function UsersList({ users = [] }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>();
  const { currentUser } = useAuth();

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (!['super-admin'].includes(currentUser.role)) {
  //   return (
  //     <div className="flex flex-1 flex-col gap-4 p-4">
  //       <div className="flex items-center justify-center h-96">
  //         <div className="text-center">
  //           <Users className="mx-auto h-12 w-12 text-muted-foreground" />
  //           <h3 className="mt-4 text-lg font-semibold">Хандах эрхгүй</h3>
  //           <p className="text-muted-foreground">
  //             Таны эрхээр ажилчдын жагсаалтыг удирдах боломжгүй.
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ажилтны жагсаалт</h1>
            <p className="text-muted-foreground">Ажилчдыг бүртгэж эрх үүргийг удирдах боломжтой.</p>
          </div>
          {['super-admin'].includes(currentUser.role) && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ажилтан нэмэх
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Хайх..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading users...</p>
            </div>
          </div>
        ) : ( */}
        <UsersTable users={filteredUsers} onEdit={setEditingUser} />
        {/* )} */}
      </div>

      {showCreateDialog && (
        <UserFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      )}

      {!!editingUser && (
        <UserFormDialog
          open={!!editingUser}
          onOpenChange={open => !open && setEditingUser(undefined)}
          user={editingUser}
        />
      )}
    </>
  );
}
