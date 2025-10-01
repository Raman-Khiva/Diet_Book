'use client'

import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/lib/redux/hooks";
import { googleRegister, googleRedirectSignIn, selectIsAuthed } from "@/lib/redux/slices/authSlice";
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Auth = () => {
    const dispatch = useAppDispatch();
    const isAuthed = useSelector(selectIsAuthed);
    const router = useRouter();
    const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

    // Check for redirect result on mount
    useEffect(() => {
        const handleRedirectResult = async () => {
            console.log("[Auth] Checking for redirect result");
            try {
                const result = await getRedirectResult(auth);
                
                if (result && result.user) {
                    console.log("[Auth] Redirect result found:", result.user.email);
                    
                    const user = {
                        uid: result.user.uid,
                        email: result.user.email,
                        displayName: result.user.displayName,
                        photoURL: result.user.photoURL,
                    };

                    const token = await result.user.getIdToken();
                    
                    // Dispatch and wait for completion
                    await dispatch(googleRedirectSignIn({ user, token })).unwrap();
                    console.log("[Auth] Successfully processed redirect sign-in");
                    
                    // Navigate after successful sign-in
                    router.replace('/tracker');
                } else {
                    console.log("[Auth] No redirect result found");
                }
            } catch (error) {
                console.error("[Auth] Error processing redirect:", error);
            } finally {
                setIsCheckingRedirect(false);
            }
        };

        handleRedirectResult();
    }, [dispatch, router]);

    const handleSignIn = async () => {
        console.log('[Auth] handleSignIn triggered');
        
        try {
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                console.log('[Auth] Mobile device detected, using signInWithRedirect');
                const provider = new GoogleAuthProvider();
                await signInWithRedirect(auth, provider);
            } else {
                console.log('[Auth] Desktop environment, dispatching googleRegister');
                const result = await dispatch(googleRegister()).unwrap();
                console.log('[Auth] googleRegister dispatch result:', result);
                if (result) {
                    console.log('[Auth] Google popup sign-up success; navigating to tracker');
                    router.replace('/tracker');
                }
            }
        } catch (err) {
            console.error('[Auth] Google sign-in failed:', err);
        }
    }

    // Show loading while checking redirect
    if (isCheckingRedirect) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Authenticating...</p>
                </div>
            </div>
        );
    }

    // Redirect if already authenticated
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
                                Sign in with your Google account to sync your diet logs and personalized recommendations.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignIn}
                            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">
                                G
                            </span>
                            Continue with Google
                            <svg
                                className="h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L12.586 11H4a1 1 0 110-2h8.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth