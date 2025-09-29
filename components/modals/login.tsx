'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useAppDispatch } from '@/lib/redux/hooks';
import { googleRegister } from '@/lib/redux/slices/authSlice';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
  redirectTo?: string;
  onSuccess?: (user: User) => void;
  onToggle?: () => void;
}

const LoginForm = ({ redirectTo = '/tracker', onSuccess, onToggle }: LoginProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSuccess = (user: User) => {
    toast({
      title: 'Welcome back! 👋',
      description: `Signed in as ${user.email ?? 'your account'}.`,
    });

    onSuccess?.(user);
    router.push(redirectTo);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      handleSuccess(credentials.user);
      form.reset();
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Unable to sign in. Please try again.';
      toast({
        title: 'Sign-in failed',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await dispatch(googleRegister()).unwrap();
      handleSuccess(result.user);
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'error' in error
          ? String((error as { error?: string }).error ?? 'Google sign-in failed. Please try again.')
          : 'Google sign-in failed. Please try again.';
      toast({
        title: 'Google sign-in failed',
        description: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in to your account</CardTitle>
        <CardDescription>
          Enter your credentials below or continue with Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="text-center text-sm text-muted-foreground">
          or
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? 'Connecting…' : 'Continue with Google'}
        </Button>
        {onToggle ? (
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggle}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
