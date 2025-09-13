import { useState } from 'react'
import GoogleSignIn from './components/GoogleSignIn'
import './App.css'

// Global declaration for Google Sign-In API
declare global {
  interface Window {
    google: any;
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignInSuccess = async (googleToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Store JWT token for future requests
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Google Sign-In successful:', data);
      } else {
        setError(data.message || 'Sign-in failed');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error: any) => {
    console.error('Google Sign-In error:', error);
    setError('Google Sign-In failed. Please try again.');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // Check if user is already signed in on component mount
  useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  });

  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🕌 Iqamah Time - Prayer Tracker</h1>
        <p>Track your daily prayers and stay connected with your faith</p>
      </header>

      <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Signing in...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '8px', 
            margin: '20px 0',
            textAlign: 'center' 
          }}>
            <p>{error}</p>
          </div>
        )}

        {!user ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px',
            padding: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '12px'
          }}>
            <h2>Welcome! Please sign in to continue</h2>
            <p>Sign in with your Google account to start tracking your prayers</p>
            <GoogleSignIn 
              onSignInSuccess={handleSignInSuccess}
              onSignInError={handleSignInError}
            />
          </div>
        ) : (
          <div style={{ 
            padding: '40px',
            backgroundColor: '#e8f5e8',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2>Welcome back, {user.name}!</h2>
            <div style={{ margin: '20px 0' }}>
              {user.avatar && (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%',
                    margin: '0 auto 15px'
                  }} 
                />
              )}
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Provider:</strong> {user.provider}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
            <button 
              onClick={handleSignOut}
              style={{
                padding: '12px 24px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
            >
              Sign Out
            </button>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
              <h3>🎉 Google Sign-In Test Successful!</h3>
              <p>Your backend integration is working perfectly. The user data has been successfully retrieved and stored.</p>
              <p><em>This is where you can now implement your prayer tracking features.</em></p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
