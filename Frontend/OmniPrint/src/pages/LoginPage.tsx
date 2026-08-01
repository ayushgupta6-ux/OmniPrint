import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();

   

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Submit Handler using mutateAsync so React Query handles async errors & states properly
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await loginMutation.mutateAsync(data);
      // Optional: navigate('/dashboard') if not handled inside useAuth
    } catch (err) {
      // Error is caught automatically by loginMutation.error
    }
  };

  // Check if login is currently in progress
  const isLoading = loginMutation.isPending;

  return (
    <main
      className="min-h-[calc(100vh-80px)] py-24"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(54,47,143,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(239,68,68,0.12), transparent 35%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] items-center">
          <section className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-secondary/80 px-4 py-2 text-sm font-semibold text-secondary-foreground">
              Secure customer login
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Welcome back to OmniPrint
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Sign in to manage your signage orders, request custom quotes, and track project status with OmniPrint.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Fast delivery</p>
                <p className="mt-2 text-sm text-muted-foreground">Get quick quotes and priority support for your print and signage orders.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Verified materials</p>
                <p className="mt-2 text-sm text-muted-foreground">Access premium acrylic, vinyl, flex, and metal signage solutions.</p>
              </div>
            </div>
          </section>

          <Card className="rounded-[1.75rem] border border-border bg-background/90 p-8 shadow-xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl">Login to your account</CardTitle>
                <CardDescription>Enter your credentials to continue to your dashboard and order history.</CardDescription>
              </div>

              {/* Display server error automatically from React Query */}
              {loginMutation.isError && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                  {(loginMutation.error as any)?.response?.data?.message || loginMutation.error?.message || 'Login failed. Please try again.'}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    className={`bg-secondary/70 border-border ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`bg-secondary/70 border-border ${errors.password ? 'border-destructive' : ''}`}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}  
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  New to OmniPrint?{' '}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create an account
                  </Link>
                </p>
                <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
                  Need help signing in?
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}