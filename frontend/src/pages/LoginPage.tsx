import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import { Smartphone, BarChart3, Loader2, RotateCcw } from "lucide-react";

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSignInSuccess = async (googleToken: string) => {
    setSigningIn(true);
    const success = await signIn(googleToken);
    if (!success) {
      setSigningIn(false);
    }
    // If successful, the user will be redirected via the Navigate component above
  };

  const handleSignInError = (error: any) => {
    console.error("Google Sign-In error:", error);
    setSigningIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="absolute left-1/2 md:-bottom-[300px] -bottom-[220px] md:w-[350px] md:h-[400px] w-[250px] h-[300px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#CCAC2A,_#FDD535)] blur-[120px] md:blur-[150px] z-0" />
        <div className="border border-[#FDD535]/80 rounded-2xl md:p-8 p-4 bg-[#FDD53526] shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-600">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-3">
              <img
                src="/images/prayer-mat.png"
                alt="Logo"
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold bg-gradient-to-br from-[#62d599] via-[#0ab499] to-[#196f54] bg-clip-text text-transparent">
                Iqamah Time
              </h1>
            </div>
            <p className="font-medium">Stay connected with your faith</p>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold !mb-2">Welcome</h2>
            <p className="leading-relaxed">
              Sign in to track your daily prayers and maintain your spiritual
              journey
            </p>
          </div>

          <div className="mb-8">
            {signingIn ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-medium">Signing you in...</p>
              </div>
            ) : (
              <GoogleSignIn
                onSignInSuccess={handleSignInSuccess}
                onSignInError={handleSignInError}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#FDD53526] rounded-lg">
              <Smartphone className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm font-medium">Track Daily Prayers</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FDD53526] rounded-lg">
              <RotateCcw className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm font-medium">Dhikr Counter</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#FDD53526] rounded-lg">
              <BarChart3 className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm font-medium">Progress Insights</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/90 text-sm">
            Join thousands of believers in their spiritual journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
