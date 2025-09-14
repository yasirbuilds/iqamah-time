import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import { 
  Building2, 
  Smartphone, 
  Bell, 
  BarChart3,
  Loader2
} from 'lucide-react';

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
    console.error('Google Sign-In error:', error);
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
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-600">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Building2 className="w-10 h-10 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Iqamah Time
              </h1>
            </div>
            <p className="text-gray-600 font-medium">Stay connected with your faith</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600 leading-relaxed">
              Sign in to track your daily prayers and maintain your spiritual journey
            </p>
          </div>

          <div className="mb-8">
            {signingIn ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-indigo-600 font-medium">Signing you in...</p>
              </div>
            ) : (
              <GoogleSignIn 
                onSignInSuccess={handleSignInSuccess}
                onSignInError={handleSignInError}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Smartphone className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Track Daily Prayers</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Bell className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Prayer Reminders</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">Progress Insights</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Join thousands of believers in their spiritual journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
