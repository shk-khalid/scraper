import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const redirectTo = '/merchant/contracts';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      toast.error('All fields are mandatory.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password);
      toast.success('Registration successful! Please check your email.');
      navigate('/login');
    } catch (err: any) {
      console.error('Caught in Register:', err);
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Enter your details to get started"
      welcomeLines={['Join us today!', 'Start scraping in seconds']}
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
          <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-800 tw-mb-1">
            Password
          </label>
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Lock className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="tw-py-4 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-400 hover:tw-text-cyan-600 focus:tw-outline-none"
            >
              {showPassword ? <EyeOff className="tw-h-5 tw-w-5" /> : <Eye className="tw-h-5 tw-w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="tw-relative">
          <label htmlFor="confirm" className="tw-block tw-text-sm tw-font-medium tw-text-gray-800 tw-mb-1">
            Confirm Password
          </label>
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Lock className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </div>
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="tw-py-4 tw-pl-10 tw-block tw-w-full tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-400 hover:tw-text-cyan-600 focus:tw-outline-none"
            >
              {showConfirm ? <EyeOff className="tw-h-5 tw-w-5" /> : <Eye className="tw-h-5 tw-w-5" />}
            </button>
          </div>
        </div>

        {/* Register button */}
        <div className="tw-space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              tw-w-full tw-flex tw-justify-center tw-items-center
              tw-py-2.5 tw-px-4 tw-border tw-border-transparent tw-rounded-md
              tw-font-medium tw-text-white tw-bg-slate-900 hover:tw-bg-slate-800
              focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-slate-700
              tw-transition-colors tw-duration-200
              ${isLoading ? 'disabled:tw-opacity-70 disabled:tw-cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? <Loader className="tw-h-5 tw-w-5 tw-animate-spin" /> : 'Register'}
          </button>

          <p className="tw-text-center tw-text-sm tw-text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="tw-font-medium tw-text-slate-900 hover:tw-underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Or divider */}
        <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2">
          <span className="tw-border-b tw-border-gray-400 tw-w-1/5"></span>
          <span className="tw-text-xs tw-text-gray-500">or</span>
          <span className="tw-border-b tw-border-gray-400 tw-w-1/5"></span>
        </div>

        {/* Google Sign‑up */}
        <div>
          <GoogleLogin
            onSuccess={async (credentialResponse: CredentialResponse) => {
              try {
                const idToken = credentialResponse.credential;
                if (!idToken) throw new Error('No ID token returned from Google');
                await loginWithGoogle(idToken);
                toast.success('Signed up & logged in with Google!');
                navigate(redirectTo, { replace: true });
              } catch (err: any) {
                console.error('Google signup error:', err);
                toast.error(err.message || 'Google signup failed.');
              }
            }}
            onError={() => {
              toast.error('Google signup was cancelled or failed.');
            }}
            useOneTap={false}
          />
        </div>


      </form>
    </AuthLayout>
  );
};

export default Register;
