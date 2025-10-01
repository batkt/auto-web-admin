'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import CustomInput from '../ui/custom/custom-input';
import { login } from '@/lib/actions/auth';
import { LoginInput } from '@/lib/types/auth.types';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { control, handleSubmit } = useForm<LoginInput>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginInput) => {
    const res = await login(values);
    if (res.code !== 200) {
      toast.error(res.message);
      return;
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="py-6">
            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Нэвтрэх</h1>
                  <p className="text-balance text-muted-foreground">Системд тавтай морилно уу</p>
                </div>
                <div className="grid gap-2">
                  <Controller
                    name="username"
                    control={control}
                    rules={{
                      required: 'Нэвтрэх нэр оруулна уу.',
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        label="Нэвтрэх нэр"
                        placeholder="Нэвтрэх нэр"
                        type="text"
                        error={error}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Нууц үг оруулна уу.',
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        label="Нууц үг"
                        placeholder="Нууц үг"
                        type="password"
                        error={error}
                        {...field}
                      />
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Нэвтрэх
                </Button>
              </div>
            </form>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              height={400}
              width={400}
              className="absolute h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
