import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    // In a real implementation, call authService here
    setSuccess(true);
  };

  return (
    <div className="w-full bg-background min-h-[80vh] flex items-center justify-center py-space-2xl px-margin-desktop">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
        <div className="text-center mb-space-xl">
          <h1 className="font-headline-xl font-bold text-primary mb-2">Forgot Password?</h1>
          <p className="font-body-md text-on-surface-variant">Enter your registered email address.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-primary-container/30 text-on-primary-container p-4 rounded-xl mb-6">
              <span className="material-symbols-outlined text-[48px] text-primary mb-2">mark_email_read</span>
              <p className="font-body-md">If an account exists with this email, we’ll send you a password reset link to <strong>{email}</strong>.</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="w-full py-3.5 text-[16px]">Return to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                placeholder="e.g. user@example.com"
              />
            </div>

            <Button type="submit" className="w-full py-3.5 text-[16px] mt-4">Send Reset Link</Button>
            
            <div className="pt-4 text-center">
              <Link to="/login" className="text-primary font-bold hover:underline text-sm flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
