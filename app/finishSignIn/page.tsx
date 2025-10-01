'use client'

import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/lib/redux/hooks";
import { emailLinkSignIn } from "@/lib/redux/slices/authSlice";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const FinishSignInPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            setProcessing(false);
            return;
        }

        const finishSignIn = async () => {
            const currentUrl = window.location.href;

            if (!isSignInWithEmailLink(auth, currentUrl)) {
                setProcessing(false);
                setError("This link is invalid or has expired. Please request a new sign-in link.");
                return;
            }

            const storedEmail = window.localStorage.getItem("emailForSignIn");

            if (storedEmail) {
                try {
                    const result = await signInWithEmailLink(auth, storedEmail, currentUrl);
                    const token = await result.user.getIdToken();
                    const user = {
                        uid: result.user.uid,
                        email: result.user.email,
                        displayName: result.user.displayName,
                        photoURL: result.user.photoURL,
                    };

                    dispatch(emailLinkSignIn({ user, token }));
                    window.localStorage.removeItem("emailForSignIn");
                    setSuccess(true);
                    router.replace('/tracker');
                } catch (err) {
                    console.error('[FinishSignIn] Automatic completion failed:', err);
                    setProcessing(false);
                    setError('Failed to complete sign-in. Please confirm your email below.');
                }
            } else {
                setProcessing(false);
            }
        };

        finishSignIn();
    }, [dispatch, router]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        if (!email.trim()) {
            setError('Please enter the email address you used to request the magic link.');
            return;
        }

        if (typeof window === "undefined") {
            setError('Unable to complete sign-in in this environment. Please retry in your browser.');
            return;
        }

        try {
            setProcessing(true);
            const result = await signInWithEmailLink(auth, email.trim(), window.location.href);
            const token = await result.user.getIdToken();
            const user = {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
            };

            dispatch(emailLinkSignIn({ user, token }));
            window.localStorage.removeItem('emailForSignIn');
            setSuccess(true);
            router.replace('/tracker');
        } catch (err) {
            console.error('[FinishSignIn] Manual completion failed:', err);
            setProcessing(false);
            setError('Failed to complete sign-in. Please request a new magic link.');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
                <div className="rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 p-10 text-center">
                    <div className="text-emerald-600 dark:text-emerald-400 text-lg font-semibold">Welcome back!</div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Redirecting to your tracker…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center px-4 py-16">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-emerald-200/40 via-transparent to-sky-200/40 blur-2xl dark:from-emerald-500/20 dark:via-transparent dark:to-sky-500/20" />
                <div className="rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 p-10">
                    <div className="flex flex-col gap-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Complete your sign-in
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Enter the email address associated with the magic link to finish signing in.
                            </p>
                        </div>
                        {error && (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">
                                {error}
                            </div>
                        )}
                        {processing && !error && (
                            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                Verifying your magic link…
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                    autoComplete="email"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400"
                            >
                                {processing ? 'Verifying…' : 'Finish sign-in'}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                            Having trouble? Request a new magic link from the sign-in page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishSignInPage;
