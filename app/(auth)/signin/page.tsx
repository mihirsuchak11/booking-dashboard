
import { SignInForm } from "./sign-in-form";
import { GoogleSignInButton } from "./google-sign-in-button";

// Error messages for OAuth failures
const errorMessages: Record<string, string> = {
  no_code: "Authentication failed. Please try again.",
  exchange_failed: "Unable to complete sign-in. Please try again.",
  callback_failed: "An error occurred during sign-in. Please try again.",
  no_user: "No user account found. Please try again.",
  access_denied: "Access was denied. Please try again.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const errorMessage = error ? errorMessages[error] || "An unknown error occurred." : null;

  return (
    <div 
      className="dark min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, var(--auth-bg-from), var(--auth-bg-via), var(--auth-bg-to))` }}
    >
      {/* Premium Background Effects */}
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at top, var(--auth-glow-primary), transparent 50%)` }} 
      />
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at bottom right, var(--auth-glow-secondary), transparent 50%)` }} 
      />
      <div 
        className="absolute inset-0" 
        style={{ background: `radial-gradient(ellipse at bottom left, var(--auth-glow-tertiary), transparent 50%)` }} 
      />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 [background-size:64px_64px]" 
        style={{ backgroundImage: `linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px)` }}
      />
      
      {/* Floating Glow Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full blur-3xl" 
        style={{ background: `radial-gradient(circle at center, var(--auth-glow-primary), transparent 60%)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full blur-3xl" 
        style={{ background: `radial-gradient(circle at center, var(--auth-glow-secondary), transparent 60%)` }}
      />

      {/* Main Card Container */}
      <div 
        className="relative w-full max-w-[1128px] grid lg:grid-cols-2 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl min-h-[600px]"
        style={{ 
          backgroundColor: `var(--auth-card-bg)`, 
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: `var(--auth-card-border)`,
          boxShadow: `0 25px 50px -12px var(--auth-card-shadow)` 
        }}
      >
        {/* Top shine effect */}
        <div 
          className="absolute inset-x-0 top-0 h-px" 
          style={{ background: `linear-gradient(to right, transparent, var(--auth-shine), transparent)` }}
        />

        {/* Left Side - Form */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Logo/Brand */}
            <div className="text-xl font-semibold text-foreground">AI tele caller</div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Sign in
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to view your booking dashboard.
              </p>
            </div>

            {/* OAuth Error Alert */}
            {errorMessage && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {errorMessage}
              </div>
            )}

            {/* Google Sign-In Button */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase text-muted-foreground">
                Or continue with email
              </span>
              <span className="flex-1 h-px bg-border" />
            </div>

            {/* Email/Password Form */}
            <SignInForm />

            <p className="text-xs text-muted-foreground text-center pt-4">
              By clicking continue, you agree to our
              <br />
              <a href="#" className="underline hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Side - Premium Visual (Hidden on mobile) */}
        <div className="hidden lg:block relative overflow-hidden">
          {/* Gradient Background */}
          <div 
            className="absolute inset-0" 
            style={{ background: `linear-gradient(to bottom right, var(--auth-panel-bg-from), var(--auth-panel-bg-via), var(--auth-panel-bg-to))` }}
          />
          
          {/* Animated Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 [background-size:32px_32px]" 
            style={{ backgroundImage: `linear-gradient(to right, var(--auth-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-grid-color) 1px, transparent 1px)` }}
          />
          
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl backdrop-blur-sm flex items-center justify-center"
                style={{ 
                  backgroundColor: `var(--auth-icon-bg)`, 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: `var(--auth-icon-border)` 
                }}
              >
                <svg className="w-10 h-10" style={{ color: `var(--auth-icon-color)` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: `var(--auth-text-primary)` }}>Smart Calling</h3>
              <p className="text-sm max-w-[200px] mx-auto" style={{ color: `var(--auth-text-secondary)` }}>AI-powered telecalling that converts leads into bookings</p>
            </div>
          </div>
          
          {/* Corner Accents */}
          <div 
            className="absolute top-0 right-0 w-32 h-32" 
            style={{ background: `linear-gradient(to bottom left, var(--auth-card-border), transparent)` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-32 h-32" 
            style={{ background: `linear-gradient(to top right, var(--auth-grid-color), transparent)` }}
          />
        </div>

      </div>
      <div className="relative mt-8 text-center text-xs" style={{ color: `var(--auth-text-muted)` }}>
        © {new Date().getFullYear()} AI tele caller. All rights reserved.
      </div>
    </div>
  );
}

