'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

// GitHub icon component
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  const isSignUp = mode === 'signup';

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-text-muted">
          {isSignUp ? 'Start building in seconds' : 'Sign in to your account'}
        </p>
      </div>

      {/* Auth card */}
      <div className="rounded-xl border border-charcoal-700 bg-charcoal-800/50 p-6 sm:p-8">
        {/* Social auth buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700 border border-charcoal-600 text-text-primary hover:bg-charcoal-600 transition-colors"
          >
            <GitHubIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700 border border-charcoal-600 text-text-primary hover:bg-charcoal-600 transition-colors"
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-charcoal-800/50 text-text-dimmed">OR</span>
          </div>
        </div>

        {/* Email/password form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />

          {/* Email field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-text-muted uppercase tracking-wider"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.email}
              required
              maxLength={50}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-lg bg-charcoal-700 border-charcoal-600 text-text-primary placeholder:text-text-dimmed focus:border-brand-blue focus:ring-brand-blue"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-text-muted uppercase tracking-wider"
              >
                Password
              </Label>
              <span className="text-xs text-text-dimmed">Min 8 chars</span>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              defaultValue={state.password}
              required
              minLength={8}
              maxLength={100}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-charcoal-700 border-charcoal-600 text-text-primary placeholder:text-text-dimmed focus:border-brand-blue focus:ring-brand-blue"
            />
          </div>

          {/* Error message */}
          {state?.error && (
            <div className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
              {state.error}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-brand-blue hover:bg-brand-blue-hover text-white font-medium"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Terms text (only on signup) */}
        {isSignUp && (
          <p className="mt-4 text-center text-xs text-text-dimmed">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-brand-blue hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-blue hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>

      {/* Switch mode link */}
      <div className="mt-6 text-center">
        <span className="text-text-muted">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        </span>
        <Link
          href={`${isSignUp ? '/sign-in' : '/sign-up'}${redirect ? `?redirect=${redirect}` : ''}${priceId ? `${redirect ? '&' : '?'}priceId=${priceId}` : ''}`}
          className="text-brand-blue hover:underline font-medium"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </div>
    </div>
  );
}
