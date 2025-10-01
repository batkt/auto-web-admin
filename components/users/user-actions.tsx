'use client';

import * as React from 'react';
import { MoreHorizontal, Edit, Key, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { User } from '@/lib/types/user.types';
import { useAuth } from '@/contexts/auth-context';
import { deleteUser, resetUserPassword } from '@/lib/actions/user';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserActions({ user, onEdit }: UserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { currentUser } = useAuth();

  const handleResetPassword = async () => {
    try {
      const res = await resetUserPassword(user._id);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      toast.success('Нууц үг амжилттай сэргээгдлээ.');
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error('Нууц үг сэргээхэд алдаа гарлаа', {
        description: message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteUser(user._id);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      toast.success('Ажилтан устлаа.');
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error('Ажилтан устгахад алдаа гарлаа', {
        description: message,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Edit className="mr-2 h-4 w-4" />
            Засах
          </DropdownMenuItem>
          {currentUser.role === 'super-admin' && (
            <DropdownMenuItem onClick={handleResetPassword}>
              <Key className="mr-2 h-4 w-4" />
              Нууц үг сэргээх
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
            }}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Устгах
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {showPassword && canShowPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg border max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Password for {user.username}</h3>
            <div className="bg-muted p-3 rounded font-mono text-sm break-all">{user.password}</div>
            <Button className="w-full mt-4" onClick={() => setShowPassword(false)}>
              Close
            </Button>
          </div>
        </div>
      )} */}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ажилтан устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг хийвэл буцаах боломжгүй. Та <strong> {user.username}</strong> нэвтрэх
              нэртэй ажилтанг системээс устгах гэж байна.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Буцах</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
