import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signupSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { registerMutation } = useAuth();

  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    setServerError(null); // Clear previous errors on retry
    try {
      await registerMutation.mutateAsync(data);
      navigate('/login'); // Redirect to login on success
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  const isLoading = registerMutation.isPending;

  return (
    <main
      className="min-h-[calc(100vh-80px)] py-24"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(54,47,143,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(239,68,68,0.12), transparent 35%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <section className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-secondary/80 px-4 py-2 text-sm font-semibold text-secondary-foreground">
              Start a new project
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Create your OmniPrint account
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Sign up to request custom signage, track orders, and access dedicated support from OmniPrint.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Free quote access</p>
                <p className="mt-2 text-sm text-muted-foreground">Submit your project details for a fast, tailored estimate.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Trusted service</p>
                <p className="mt-2 text-sm text-muted-foreground">Partner with an expert signage team.</p>
              </div>
            </div>
          </section>

          <Card className="rounded-[1.75rem] border border-border bg-background/90 p-8 shadow-xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl">Create a new account</CardTitle>
                <CardDescription>Complete the form below to join the OmniPrint customer portal.</CardDescription>
              </div>

              {serverError && (
                <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                  {serverError}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}> 
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Full name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      {...register('name')}
                      className={`bg-secondary/70 border-border ${errors.name ? 'border-destructive' : ''}`}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                  </div>

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
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                      Phone number
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 99999xx999"
                      {...register('phoneNumber')}
                      className={`bg-secondary/70 border-border ${errors.phoneNumber ? 'border-destructive' : ''}`}
                    />
                    {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message as string}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...register('password')}
                      className={`bg-secondary/70 border-border ${errors.password ? 'border-destructive' : ''}`}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message as string}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
                <Link to="/contact" className="text-sm font-medium text-primary hover:underline">
                  Contact support
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}