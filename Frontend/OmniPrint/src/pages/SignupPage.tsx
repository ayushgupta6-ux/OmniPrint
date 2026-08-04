import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signupSchema } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Store,User } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const { registerMutation } = useAuth();
  const [role, setRole] = useState<'CLIENT' | 'PRINT_AGENCY'>('CLIENT');
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

const onSubmit = async (data: any) => {
    setServerError(null);
    try {
      // Inject the selected role into the payload
      const payload = { ...data, role };
      await registerMutation.mutateAsync(payload);
      
      alert(role === 'PRINT_AGENCY' ? 'Agency Account Created! Please login.' : 'Account Created! Please login.');
      navigate('/login'); 
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
              {role === 'CLIENT' ? 'Start a new project' : 'Grow your print business'}
            </span>
            <div className="space-y-4">
             <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {role === 'CLIENT' ? 'Create your OmniPrint account' : 'Partner with OmniPrint'}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                {role === 'CLIENT' 
                  ? 'Sign up to request custom signage, track orders, and access dedicated support.' 
                  : 'Join our network of verified print agencies. Receive automated orders and manage your catalog dynamically.'}
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

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('CLIENT')}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-xl transition-all",
                    role === 'CLIENT' ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <User className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('PRINT_AGENCY')}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-xl transition-all",
                    role === 'PRINT_AGENCY' ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Store className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Print Agency</span>
                </button>
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