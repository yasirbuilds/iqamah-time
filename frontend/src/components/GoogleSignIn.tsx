import React, { useEffect, useRef } from "react";

interface GoogleSignInProps {
  onSignInSuccess: (token: string) => void;
  onSignInError: (error: any) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSignInSuccess,
  onSignInError,
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            "412098878116-bi573r16jb5rmfgb92c361lnuki5a47a.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 280,
        });
      }
    };

    const handleCredentialResponse = (response: any) => {
      if (response.credential) {
        onSignInSuccess(response.credential);
      } else {
        onSignInError("No credential received");
      }
    };

    // Check if Google script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleSignIn();
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleLoaded), 10000);
    }
  }, [onSignInSuccess, onSignInError]);

  return (
    <div className="flex justify-center items-center">
      <div
        ref={googleButtonRef}
        className="flex justify-center items-center min-h-[40px] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      ></div>
    </div>
  );
};

export default GoogleSignIn;
