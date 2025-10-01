
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  updateProfile,
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
import { googleRedirectSignIn, googleRegister } from '@/lib/redux/slices/authSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterProps {
  redirectTo?: string;
  onSuccess?: (user: User) => void;
  onToggle?: () => void;
}

const RegisterForm = ({ redirectTo = '/tracker', onSuccess, onToggle }: RegisterProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  interface User{
    uid : string;
    email : string | null;
    displayName : string | null;
    photoURL : string | null;
  }
  useEffect(()=>{
    console.log('[Register] useEffect mounted - checking redirect result');
    const handleGoogleRedirect = async () => {
      try{
        console.log('[Register] Awaiting getRedirectResult');
        const result = await getRedirectResult(auth);
        console.log('[Register] getRedirectResult returned:', result);
        if(result){
          const user : User = {
            uid : result.user.uid,
            email : result.user.email,
            displayName : result.user.displayName,
            photoURL : result.user.photoURL
          }
          console.log('[Register] Redirect result user constructed:', user);
          const token = await result.user.getIdToken();
          console.log('[Register] Redirect result token acquired');
          dispatch(googleRedirectSignIn({user,token}));
          console.log('[Register] Dispatched googleRedirectSignIn');
          handleSuccess(user);
        }
      }catch (error) {
      console.error("Redirect sign-in failed:", error);
      toast({
        title: "Google sign-in failed",
        description: "Something went wrong. Please try again.",
      });
      }finally{
        console.log('[Register] Redirect handling complete, stopping Google loading');
        setIsGoogleLoading(false);
      } 
     }   
     handleGoogleRedirect();
  },[dispatch])

  const handleSuccess = (user: User) => {
    console.log('[Register] handleSuccess invoked for user:', user.uid);
    toast({
      title: 'Welcome aboard! 🎉',
      description: `Account created for ${user.email ?? 'your email'}.`,
    });


    console.log('[Register] Navigating to redirect path:', redirectTo);
    router.push(redirectTo);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    console.log('[Register] onSubmit called with values:', values);
    setIsLoading(true);
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log('[Register] Email/password registration success:', credentials.user.uid);

      if (values.name.trim().length > 0) {
        console.log('[Register] Updating profile with display name:', values.name.trim());
        await updateProfile(credentials.user, {
          displayName: values.name.trim(),
        });
      }

      handleSuccess(credentials.user);
      form.reset();
      console.log('[Register] Form reset after successful registration');
    } catch (error: unknown) {
      console.error('[Register] Registration failed:', error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Unable to create the account. Please try again.';
      toast({
        title: 'Registration failed',
        description: message,
      });
    } finally {
      console.log('[Register] onSubmit finally - stopping loading');
      setIsLoading(false);
    }
  };

  

  const handleGoogleSignUp = async () => {
    console.log('[Register] handleGoogleSignUp triggered');
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      if(/Mobi|Android|iPhone/i.test(navigator.userAgent)){
        console.log('[Register] Mobile device detected, using signInWithRedirect');
        await signInWithRedirect(auth,provider)
      }
      else{
        console.log('[Register] Desktop environment, dispatching googleRegister');
        const result = await dispatch(googleRegister()).unwrap();
        handleSuccess(result.user);
        console.log('[Register] Google popup sign-up success');
        setIsGoogleLoading(false);  
      }
    } catch (error: unknown) {
      console.error('[Register] Google sign-up failed:', error);
      setIsGoogleLoading(false);
      const message =
        error && typeof error === 'object' && 'error' in error
          ? String((error as { error?: string }).error ?? 'Google sign-up failed. Please try again.')
          : 'Google sign-up failed. Please try again.';
      toast({
        title: 'Google sign-up failed',
        description: message,
      });
    } 
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join DietTracker to start monitoring your nutrition journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alex Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
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
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? 'Connecting…' : 'Sign up with Google'}
        </Button>
        {onToggle ? (
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggle}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
