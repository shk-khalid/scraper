// src/components/auth/AuthLayout.tsx
import React, { ReactNode } from 'react';
import Logo from "../../assets/desktopLogo.png";

interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  welcomeLines?: string[];
  noCard?: boolean;
  hideLeftOnMobile?: boolean;
  leftGradientFrom?: string;
  leftGradientTo?: string;
  rightBg?: string;
  textGradientFrom?: string;
  textGradientTo?: string;
  welcomeMarginBottomClass?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  welcomeLines,
  noCard = false,
  hideLeftOnMobile = true,
  leftGradientFrom = "#050A24",
  leftGradientTo = "#091538",
  rightBg = "#8ED1E8",
  textGradientFrom = "#FFFFFF",
  textGradientTo = "#EEEEEE",
  welcomeMarginBottomClass = "tw-mb-16",
}) => {
  const defaultWelcome = ["Welcome.", "Start your journey now with Protega!"];
  const lines = welcomeLines && welcomeLines.length > 0 ? welcomeLines : defaultWelcome;

  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row tw-h-screen">
      {/* LEFT pane */}
      <div
        className={`
          ${hideLeftOnMobile ? 'tw-hidden md:tw-flex' : 'tw-flex'}
          tw-w-full md:tw-w-1/2 tw-relative
        `}
      >
        <div
          className="tw-absolute tw-inset-0"
          style={{
            background: `linear-gradient(to bottom right, ${leftGradientFrom}, ${leftGradientTo})`,
          }}
        />
        <div className="tw-absolute tw-inset-0 tw-bg-[url('/patterns/diagonal-stripes.svg')] tw-bg-white/5 tw-pointer-events-none" />
        <div className="tw-absolute tw-top-16 tw-left-12 tw-w-40 tw-h-40 tw-bg-white/10 tw-rounded-full tw-blur-3xl tw-transform tw-scale-110 tw-animate-pulse" />
        <div className="tw-absolute tw-bottom-24 tw-right-16 tw-w-56 tw-h-56 tw-bg-white/20 tw-rounded-full tw-blur-2xl" />

        <div className="tw-relative tw-z-10 tw-flex tw-flex-col tw-justify-between tw-h-full tw-p-8">
          <img
            src={Logo}
            alt="Protega"
            className="tw-h-12 sm:tw-h-16 tw-w-auto tw-object-contain"
            style={{ alignSelf: 'flex-start' }}
          />
          <div className={`tw-self-start tw-text-left tw-text-white tw-max-w-xs ${welcomeMarginBottomClass}`}>
            {lines.length === 2 ? (
              <>
                <p
                  className="tw-text-5xl sm:tw-text-6xl tw-font-extrabold tw-leading-tight tw-tracking-tight"
                  style={{
                    background: `linear-gradient(to bottom right, ${textGradientFrom}, ${textGradientTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  }}
                >
                  {lines[0]}
                </p>
                <p
                  className="tw-text-2xl sm:tw-text-3xl tw-font-medium tw-italic tw-leading-snug tw-tracking-normal tw-mt-2"
                  style={{
                    background: `linear-gradient(to bottom right, ${textGradientFrom}, ${textGradientTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {lines[1]}
                </p>
              </>
            ) : (
              lines.map((line, idx) => (
                <p
                  key={idx}
                  className={`
                    ${idx === 0 ? 'tw-text-5xl tw-font-extrabold' : 'tw-text-2xl tw-font-medium tw-italic'}
                    tw-leading-tight tw-tracking-tight
                    ${idx > 0 ? 'tw-mt-2' : ''}
                  `}
                  style={{
                    background: `linear-gradient(to bottom right, ${textGradientFrom}, ${textGradientTo})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {line}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT pane */}
      <div
        className={`
          tw-w-full md:tw-w-1/2 tw-flex tw-items-center tw-justify-center tw-p-4 sm:tw-px-8
          ${hideLeftOnMobile ? 'tw-h-screen' : 'tw-h-auto'}
        `}
        style={{ backgroundColor: rightBg }}
      >
        {noCard ? (
          <div className="tw-w-full sm:tw-max-w-md">
            {hideLeftOnMobile && (
              <div className="tw-flex tw-justify-center tw-mb-6 md:tw-hidden">
                <img src={Logo} alt="Protega" className="tw-h-12 tw-w-auto tw-object-contain" />
              </div>
            )}
            <h2 className="tw-text-center tw-text-[#101828] tw-text-2xl sm:tw-text-3xl tw-font-extrabold tw-mb-6">
              {title}
            </h2>
            {subtitle && (
              <div className="tw-text-center tw-text-sm tw-font-bold tw-text-[#334155] tw-mb-6">
                {subtitle}
              </div>
            )}
            {children}
          </div>
        ) : (
          <div
            className="
              tw-w-full sm:tw-max-w-md
              tw-bg-white/90 tw-backdrop-blur-sm
              tw-border tw-border-gray-200/50
              tw-rounded-xl
              tw-px-6 sm:tw-px-10 tw-py-10
              tw-shadow-lg
            "
          >
            {hideLeftOnMobile && (
              <div className="tw-flex tw-justify-center tw-mb-6 md:tw-hidden">
                <img src={Logo} alt="Protega" className="tw-h-12 tw-w-auto" />
              </div>
            )}
            <h2 className="tw-text-center tw-text-[#101828] tw-text-2xl sm:tw-text-3xl tw-font-bold tw-mb-4">
              {title}
            </h2>
            {subtitle && (
              <div className="tw-text-center tw-text-sm tw-text-[#334155] tw-mb-6">
                {subtitle}
              </div>
            )}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
