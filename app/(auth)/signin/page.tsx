
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Top Logo/Text */}
      <div className="w-full max-w-[1128px] mb-8">
        <div className="text-xl font-semibold text-foreground">AI tele caller</div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[1128px] grid lg:grid-cols-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm min-h-[600px]">

        {/* Left Side - Form */}
        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-sm mx-auto space-y-6">
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <SignInForm />

            <p className="text-xs text-muted-foreground text-center pt-4">
              By clicking continue, you agree to our{" "}
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

        {/* Right Side - Placeholder Image (Hidden on mobile) */}
        <div className="hidden lg:block bg-muted/50 relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {/* Placeholder Content */}
            <div className="text-center p-6">
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center aspect-square max-w-md mx-auto">
                <span className="text-sm">Placeholder Image</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        © 2026 AI tele caller. All rights reserved.
      </div>
    </div>
  );
}

