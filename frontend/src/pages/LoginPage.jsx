import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // The route they intended to go to before being asked to login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, from]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Mock Auth logic
    if (!login(email, password)) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="w-full bg-background min-h-[80vh] flex items-center justify-center py-space-2xl px-margin-desktop">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
        <div className="text-center mb-space-xl">
          <h1 className="font-headline-xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="font-body-md text-on-surface-variant">Log in to your Neeramoy account to access your orders and fast checkout.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Email or Phone Number</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="e.g. user@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-label-md text-on-surface">Password</label>
              <a href="#" className="text-[12px] text-primary hover:underline font-bold">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" id="remember" className="w-4 h-4 text-primary accent-primary" />
            <label htmlFor="remember" className="text-body-sm text-on-surface-variant">Remember me</label>
          </div>

          <Button type="submit" className="w-full py-3.5 text-[16px]">Login</Button>
        </form>

        <div className="mt-space-lg pt-space-lg border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-on-surface-variant">
            Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
