'use client'

import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/lib/redux/hooks";
import { emailLinkSignIn, selectIsAuthed } from "@/lib/redux/slices/authSlice";
import { isSignInWithEmailLink, onAuthStateChanged, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Auth = () => {
    const dispatch = useAppDispatch();
    const isAuthed = useSelector(selectIsAuthed);
    const router = useRouter();
    const [isProcessingEmailLink, setIsProcessingEmailLink] = useState(true);
    const [email, setEmail] = useState("");
    const [emailSending, setEmailSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);




    
    useEffect(() => {
        if (typeof window === "undefined") {
            setIsProcessingEmailLink(false);
            return;
        }

        const processEmailLinkSignIn = async () => {
            if (!isSignInWithEmailLink(auth, window.location.href)) {
                setIsProcessingEmailLink(false);
                return;
            }

            let emailForLink: string | null = window.localStorage.getItem("emailForSignIn");

            if (!emailForLink) {
                emailForLink = window.prompt("Please confirm your email to complete sign in") ?? null;
            }

            if (!emailForLink) {
                setEmailError("Email is required to complete the sign-in process. Please request a new link.");
                setIsProcessingEmailLink(false);
                return;
            }

            try {
                const result = await signInWithEmailLink(auth, emailForLink, window.location.href);
                const token = await result.user.getIdToken();
                const user = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                };

                dispatch(emailLinkSignIn({ user, token }));
                window.localStorage.removeItem("emailForSignIn");
                window.history.replaceState({}, document.title, "/auth");
                router.replace('/tracker');
            } catch (error) {
                console.error('[Auth] Email link sign-in failed:', error);
                setEmailError('Failed to complete email sign-in. Please request a new link.');
            } finally {
                setIsProcessingEmailLink(false);
            }
        };

        processEmailLinkSignIn();
    }, [dispatch, router]);






    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                return;
            }

            const token = await currentUser.getIdToken();
            const user = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            };

            dispatch(emailLinkSignIn({ user, token }));
            router.replace('/tracker');
        });

        return () => unsubscribe();
    }, [dispatch, router]);

    const resolveEmailLinkRedirectUrl = useMemo(() => {
        if (typeof window === "undefined") {
            return process.env.NEXT_PUBLIC_FIREBASE_EMAIL_LINK_REDIRECT_URL ?? "";
        }

        return process.env.NEXT_PUBLIC_FIREBASE_EMAIL_LINK_REDIRECT_URL ?? `${window.location.origin}/auth`;
    }, []);





    const handleSendEmailLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('[Auth] handleSendEmailLink triggered');
        setEmailError(null);
        setEmailSent(false);

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        if (!resolveEmailLinkRedirectUrl) {
            setEmailError('Email link redirect URL is not configured.');
            return;
        }

        try {
            setEmailSending(true);
            const actionCodeSettings = {
                url: resolveEmailLinkRedirectUrl,
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, trimmedEmail, actionCodeSettings);
            if (typeof window !== "undefined") {
                window.localStorage.setItem('emailForSignIn', trimmedEmail);
            }
            setEmailSent(true);
            console.log('[Auth] Email sign-in link sent successfully');
        } catch (err) {
            console.error('[Auth] Failed to send email link:', err);
            setEmailError('Failed to send sign-in link. Please try again.');
        } finally {
            setEmailSending(false);
        }
    };





    if (isProcessingEmailLink) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Authenticating...</p>
                </div>
            </div>
        );
    }



    if (isAuthed) {
        console.log("[Auth] User is authenticated, redirecting to /tracker");
        router.replace('/tracker');
        return null;
    }



    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center px-4 py-16">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-emerald-200/40 via-transparent to-sky-200/40 blur-2xl dark:from-emerald-500/20 dark:via-transparent dark:to-sky-500/20" />
                <div className="rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 p-10">
                    <div className="flex flex-col items-center text-center gap-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                            Secure Access
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                                Authenticate to continue
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Sign in with a magic link or your Google account to sync your diet logs and personalized recommendations.
                            </p>
                        </div>
                        <form onSubmit={handleSendEmailLink} className="w-full space-y-4 text-left">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (emailError) {
                                            setEmailError(null);
                                        }
                                    }}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {emailError && (
                                <p className="text-sm text-red-500">
                                    {emailError}
                                </p>
                            )}
                            {emailSent && !emailError && (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    Magic link sent! Check your inbox and open the link on this device to finish signing in.
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={emailSending}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-white/90 px-6 py-3 text-sm font-semibold text-emerald-600 shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                            >
                                {emailSending ? 'Sending magic link…' : 'Send magic link'}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
