import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    const success = await register(formData);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full bg-background min-h-[80vh] flex items-center justify-center py-space-2xl px-margin-desktop">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
        <div className="text-center mb-space-lg">
          <h1 className="font-headline-xl font-bold text-primary mb-2">Create Account</h1>
          <p className="font-body-md text-on-surface-variant">Join Neeramoy for seamless healthcare access.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Name *</label>
            <input 
              type="text" name="fullName"
              value={formData.fullName} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="e.g. Hasan Mahmud"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Phone Number *</label>
            <input 
              type="tel" name="phone"
              value={formData.phone} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Email Address</label>
            <input 
              type="email" name="email"
              value={formData.email} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Password *</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleInputChange}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface text-on-surface"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-center transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Confirm Password *</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleInputChange}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface text-on-surface"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-center transition-colors"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                tabIndex={0}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full py-3.5 text-[16px] mt-2">Create Account</Button>
        </form>

        <div className="mt-space-lg pt-space-lg border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-on-surface-variant">
            Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-primary font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
