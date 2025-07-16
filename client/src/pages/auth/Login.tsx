import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/merchant/contracts';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Both fields are mandatory.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error('Caught in Login:', err);
      toast.error(err.message || 'Login failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const welcomeLines = ['Welcome Back!', 'Sign in to continue with Protega'];

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your details to continue"
      welcomeLines={welcomeLines}
      textGradientFrom="#FFFFFF"
      textGradientTo="#CCCCCC"
      leftGradientFrom="#030512"
      leftGradientTo="#02102a"
      rightBg="#22d3ee"
      welcomeMarginBottomClass="tw-mb-16"
      noCard={true}
      hideLeftOnMobile={true}
    >
      <form className="tw-space-y-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="tw-relative">
          <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-800 tw-mb-1">
            Email address
          </label>
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Mail className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="tw-py-4 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="tw-relative">
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-1">
            <label htmlFor="password" className="tw-text-sm tw-font-medium tw-text-gray-800">
              Password
            </label>
            <Link
              to="/reset-password"
              className="tw-text-xs tw-font-medium tw-text-slate-900 hover:tw-underline hover:tw-text-slate-700"
            >
              Forgot?
            </Link>
          </div>
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Lock className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="tw-py-4 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-400 hover:tw-text-cyan-600 focus:tw-outline-none"
            >
              {showPassword ? <EyeOff className="tw-h-5 tw-w-5" /> : <Eye className="tw-h-5 tw-w-5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              tw-w-full tw-flex tw-justify-center tw-items-center
              tw-py-2.5 tw-px-4
              tw-border tw-border-transparent tw-rounded-md
              tw-font-medium tw-text-white
              tw-bg-slate-900 hover:tw-bg-slate-800
              focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-slate-700
              tw-transition-colors tw-duration-200
              ${isLoading ? 'disabled:tw-opacity-70 disabled:tw-cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? <Loader className="tw-h-5 tw-w-5 tw-animate-spin" /> : 'Sign in'}
          </button>
        </div>
        
      </form>
    </AuthLayout>
  );
};

export default Login;
