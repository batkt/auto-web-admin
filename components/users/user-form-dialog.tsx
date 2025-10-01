'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, UserInput, UserRoles } from '@/lib/types/user.types';
import { useAuth } from '@/contexts/auth-context';
import { createUser, updateUser } from '@/lib/actions/user';
import { toast } from 'sonner';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { currentUser } = useAuth();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isDirty },
  } = useForm<UserInput>({
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      role: UserRoles.USER,
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileImageUrl: user.profileImageUrl || '',
      });
    } else {
      reset({
        username: '',
        firstname: '',
        lastname: '',
        role: UserRoles.USER,
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: UserInput) => {
    try {
      if (isEditing) {
        const res = await updateUser(user._id, data);
        if (res.code !== 200) {
          throw new Error(res.message);
        }
      } else {
        const res = await createUser(data);
        if (res.code !== 200) {
          throw new Error(res.message);
        }
      }
      onOpenChange(false);
    } catch (err) {
      let message = '';
      if (err instanceof Error) {
        message = err.message;
      }
      toast.error('Ажилтан бүртгэхэд алдаа гарлаа', {
        description: message,
      });
    }
  };

  const values = watch();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Засах' : 'Бүртгэх'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Ажилтны мэдээлэл засах.' : 'Шинээр ажилтан бүртгэх'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={values.profileImageUrl || 'https://placehold.co/80'} />
                <AvatarFallback className="text-lg">
                  {values.firstname?.[0]?.toUpperCase()}
                  {values.lastname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">Нэр</Label>
                <Input {...register('firstname', { required: 'Нэр оруулна уу.' })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Овог</Label>
                <Input {...register('lastname', { required: 'Овог оруулна уу.' })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Нэвтрэх нэр</Label>
              <Input
                {...register('username', { required: 'Нэвтрэх нэр оруулна уу.' })}
                disabled={isEditing}
              />
            </div>

            {currentUser.role === 'super-admin' && (
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <Label>Үүрэг</Label>
                    <Select
                      value={field.value}
                      onValueChange={value => field.onChange(value as UserRoles)}
                    >
                      <SelectTrigger disabled={currentUser._id === user?._id} className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Хэрэглэгч</SelectItem>
                        <SelectItem value="admin">Админ</SelectItem>
                        <SelectItem value="super-admin">Супер админ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Хаах
            </Button>
            <Button disabled={!isDirty} type="submit">
              {isEditing ? 'Хадгалах' : 'Бүртгэх'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
