import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Loader, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import { requestPasswordOTP, resetPassword } from '@/services/authService';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const COOLDOWN_SECONDS = 180;

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'email' | 'verify'>('email');

  const [otpLoading, setOtpLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const sendOtp = async () => {
    if (!EMAIL_REGEX.test(email)) {
      return toast.error('Invalid email format');
    }
    setOtpLoading(true);
    const { data, error } = await requestPasswordOTP(email);
    setOtpLoading(false);

    if (error) return toast.error(error.message || 'Could not send OTP. Try again.');
    if (!data?.success) return toast.error(data?.message || 'Email not available');

    toast.success('OTP sent. Check your email.');
    setStage('verify');
    setCooldown(COOLDOWN_SECONDS);
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stage === 'email') return sendOtp();

    const otpStr = otp.join('');
    if (otp.some(d => !d)) return toast.error('Enter full OTP');
    if (!password || !confirmPassword) return toast.error('Enter both passwords');
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    setContinueLoading(true);
    const { data, error } = await resetPassword(email, password, otpStr);
    setContinueLoading(false);

    if (error) return toast.error(error.message || 'Failed to reset password');
    if (!data?.success) return toast.error(data?.message || 'Password reset failed');

    toast.success('Password reset successfully');
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(text)) return toast.error('Paste 6 digits only');
    const arr = text.split('');
    setOtp(arr);
    arr.forEach((val, i) => {
      if (inputsRef.current[i]) inputsRef.current[i]!.value = val;
    });
    inputsRef.current[5]?.focus();
  };

  const otpButtonLabel = () => {
    if (otpLoading && stage === 'email') return <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />;
    if (stage === 'email') return 'Send OTP';
    if (cooldown > 0) return `Resend OTP (${formatTime(cooldown)})`;
    return 'Resend OTP';
  };

  const otpButtonDisabled = otpLoading || (stage === 'verify' && cooldown > 0);




  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll help you get back in"
      welcomeLines={[
        "Forgot your password?",
        "Let’s reset it securely with your email",
      ]}
      textGradientFrom="#FFFFFF"
      textGradientTo="#CCCCCC"
      leftGradientFrom="#030512"
      leftGradientTo="#02102a"
      rightBg="#22d3ee"
      welcomeMarginBottomClass="tw-mb-16"
      noCard={true}
      hideLeftOnMobile={true}
    >
      <form className="tw-space-y-4" onSubmit={handleContinue}>
        {/* EMAIL + SEND OTP */}
        <div className="tw-flex tw-space-x-2">
          <div className="tw-flex-1 tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <Mail className="tw-h-5 tw-w-5 tw-text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              disabled={stage === "verify"}
              className={`tw-w-full tw-pl-10 tw-py-3 tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 ${stage === 'verify' ? 'tw-cursor-not-allowed tw-text-gray-600' : 'tw-text-gray-200'} tw-text-sm`}
              required
            />
          </div>

          <button
            type="button"
            onClick={sendOtp}
            disabled={otpButtonDisabled}
            className={`tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-4 tw-rounded-md tw-text-sm tw-font-medium
            ${otpButtonDisabled
                ? "tw-bg-slate-900 tw-opacity-60 tw-cursor-not-allowed"
                : "tw-bg-slate-900 hover:tw-bg-slate-800 tw-transition-colors tw-duration-200"}
            tw-text-white focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-slate-700`}
          >
            {otpButtonLabel()}
          </button>
        </div>

        {stage === "verify" && (
          <>
            {/* OTP Fields */}
            <div onPaste={handlePaste}>
              <div className="tw-flex tw-justify-between tw-max-w-xs tw-mx-auto tw-space-x-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => inputsRef.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    defaultValue={d}
                    onChange={e => handleInputChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="tw-w-10 tw-h-10 tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md tw-text-center tw-text-white tw-text-lg focus:tw-border-cyan-500"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div className="tw-relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="New password"
                className="tw-w-full tw-py-3 tw-pl-4 tw-pr-10 tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-400 hover:tw-text-cyan-600 focus:tw-outline-none"
              >
                {showPwd ? (
                  <EyeOff className="tw-h-5 tw-w-5" />
                ) : (
                  <Eye className="tw-h-5 tw-w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="tw-relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="tw-w-full tw-py-3 tw-pl-4 tw-pr-10 tw-bg-gray-900 tw-border tw-border-gray-700 tw-rounded-md focus:tw-border-cyan-500 tw-text-gray-200 tw-text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((c) => !c)}
                className="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center tw-text-gray-400 hover:tw-text-cyan-600 focus:tw-outline-none"
              >
                {showConfirm ? (
                  <EyeOff className="tw-h-5 tw-w-5" />
                ) : (
                  <Eye className="tw-h-5 tw-w-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={continueLoading}
              className={`tw-w-full tw-flex tw-justify-center tw-items-center
              tw-py-2.5 tw-px-4 
              tw-border tw-border-transparent tw-rounded-md 
              tw-font-medium tw-text-white 
              tw-bg-slate-900 hover:tw-bg-slate-800 
              focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-slate-700
              tw-transition-colors tw-duration-200
              ${continueLoading ? "disabled:tw-opacity-70 disabled:tw-cursor-not-allowed" : ""}
            `}
            >
              {continueLoading ? (
                <Loader className="tw-h-5 tw-w-5 tw-animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );

};

export default ResetPassword;
