import { LoginForm } from '@/components/login-form';
import { ACCESS_TOKEN_KEY, getCookie } from '@/lib/cookie';
import { redirect } from 'next/navigation';

export default async function Home() {
  const token = await getCookie(ACCESS_TOKEN_KEY);

  if (token) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
