'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserActions } from './user-actions';
import type { User } from '@/lib/types/user.types';
import { dateFormatter } from '@/utils';
import { useAuth } from '@/contexts/auth-context';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  const { currentUser } = useAuth();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ажилтан</TableHead>
            <TableHead>Нэвтрэх нэр</TableHead>
            <TableHead>Үүрэг</TableHead>
            {/* <TableHead>Нууц үгийн төлөв</TableHead> */}
            <TableHead>Бүртгэгдсэн огноо</TableHead>
            {currentUser?.role === 'super-admin' && (
              <TableHead className="w-[70px]">Үйлдэл</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || 'https://placehold.co/32'} />
                  <AvatarFallback>
                    {user.firstname[0]?.toUpperCase()}
                    {user.lastname[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.firstname} {user.lastname}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono">{user.username}</TableCell>
              <TableCell>
                <Badge variant={'outline'}>{user.role.replace('-', ' ')}</Badge>
              </TableCell>
              {/* <TableCell>
                <Badge variant={user.passwordGenerated ? 'outline' : 'secondary'}>
                  {user.passwordGenerated ? 'Default' : 'Өөрчилсөн'}
                </Badge>
              </TableCell> */}
              <TableCell className="text-sm text-muted-foreground">
                {dateFormatter(user.createdAt)}
              </TableCell>
              {currentUser?.role === 'super-admin' && (
                <TableCell>
                  <UserActions user={user} onEdit={onEdit} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
