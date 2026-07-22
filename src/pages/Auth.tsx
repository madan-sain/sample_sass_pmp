import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';

export const Auth: React.FC = () => {
  const { setCurrentPage, addToast } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  
  // Fields state
  const [email, setEmail] = useState('ethan@acme.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Sign-in successful. Welcome back, Ethan!', 'success');
      setCurrentPage('workspace-select');
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    if (!agreeTerms) {
      addToast('You must agree to the Terms of Service.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Registration successful! Welcome to Antigravity.', 'success');
      setCurrentPage('workspace-select');
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Reset password link has been sent to ' + email, 'success');
      setAuthMode('login');
    }, 1500);
  };



  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative select-none">
      
      {/* Split Layout: Left side illustration card (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 border-r border-border/40 p-12 flex-col justify-between relative overflow-hidden text-left select-none">
        
        {/* Glow Spheres */}
        <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-primary/20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-secondary/15 blur-[90px] rounded-full pointer-events-none" />

        {/* Brand */}
        <button 
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-3 cursor-pointer self-start"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold shadow">
            A
          </div>
          <span className="font-extrabold text-lg text-white">Antigravity Projects</span>
        </button>

        {/* Testimonial/Intro */}
        <div className="max-w-md relative z-10 flex flex-col gap-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold self-start">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Redefining Workspaces</span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Accelerate your team's development cycles with modern Kanban.
          </h2>

          <div className="flex flex-col gap-4.5 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-success shrink-0" />
              <span className="text-xs font-semibold text-white/90">Tailwind CSS v4 framework build</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-success shrink-0" />
              <span className="text-xs font-semibold text-white/90">Integrated messages, cloud storage, & settings</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4.5 w-4.5 text-success shrink-0" />
              <span className="text-xs font-semibold text-white/90">Premium glassmorphism light & dark mode</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-white/50 flex gap-4">
          <span>&copy; 2026 Antigravity Inc.</span>
          <a href="#" className="hover:text-white/80">Support</a>
          <a href="#" className="hover:text-white/80">Terms</a>
        </div>
      </div>

      {/* Right side: Login forms */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12 relative">
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-glow-blue blur-[100px] rounded-full pointer-events-none opacity-20 dark:opacity-30" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-glow-purple blur-[100px] rounded-full pointer-events-none opacity-20 dark:opacity-30" />

        <div className="w-full max-w-md mx-auto relative z-10">
          
          {/* Header Mobile Brand */}
          <div className="flex lg:hidden flex-col items-center mb-8 gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold shadow">
              A
            </div>
            <span className="font-extrabold text-xl tracking-tight">Antigravity Projects</span>
          </div>

          {/* Render Active Forms */}
          {authMode === 'login' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Welcome Back</h2>
                <p className="text-xs text-muted-foreground mt-1.5">Sign in to manage your workspaces.</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="h-4.5 w-4.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    leftIcon={<Lock className="h-4.5 w-4.5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground/60 hover:text-foreground cursor-pointer focus:outline-none flex items-center justify-center"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs mt-1">
                  <Checkbox label="Remember me" checked />
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" className="w-full mt-2" loading={loading}>
                  Sign In <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </form>

              <div className="relative flex items-center justify-center my-1.5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60"></div></div>
                <span className="relative bg-background px-3 text-[10px] font-bold text-muted-foreground uppercase">Or Continue With</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-xs font-bold gap-2">
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  Google
                </Button>
                <Button variant="outline" className="text-xs font-bold gap-2">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4 select-none">
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {authMode === 'register' && (
            <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-right-4 duration-250">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Create Account</h2>
                <p className="text-xs text-muted-foreground mt-1.5">Get started for free today.</p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <Input
                  label="Full Name"
                  placeholder="Ethan Hunt"
                  leftIcon={<User className="h-4.5 w-4.5" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="h-4.5 w-4.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="h-4.5 w-4.5" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Checkbox
                  label="I agree to the Terms of Service & Privacy Policy"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />

                <Button type="submit" className="w-full mt-2" loading={loading}>
                  Sign Up <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {authMode === 'forgot' && (
            <div className="flex flex-col gap-6 text-left animate-in fade-in slide-in-from-right-4 duration-250">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Forgot Password</h2>
                <p className="text-xs text-muted-foreground mt-1.5">We will send you instructions to reset it.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<Mail className="h-4.5 w-4.5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" className="w-full mt-2" loading={loading}>
                  Send Instructions
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Remember your password?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
