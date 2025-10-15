
import React, { useState } from 'react';
// Fix: Correct import for Icons which is now created.
import { GoogleIcon } from '../icons/Icons';

interface AuthViewProps {
  onLogin: (email: string, password: string) => Promise<{success: boolean, message: string}>;
  onRegister: (email: string, username: string, password: string) => Promise<{success: boolean, message: string}>;
  siteName: string;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegister, siteName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (!isLogin) {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long.');
            return;
        }
    }
    
    setIsLoading(true);

    if (isLogin) {
        const result = await onLogin(email, password);
        if (!result.success) {
            setError(result.message);
        }
    } else {
        const result = await onRegister(email, username, password);
        if (!result.success) {
            setError(result.message);
        }
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-zinc-900 text-white flex flex-col justify-center items-center p-6 max-w-md mx-auto">
      <div className="w-full text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
          {siteName.toUpperCase()}
        </h1>
        <p className="text-gray-400 mt-2">
          {isLogin ? 'Welcome back!' : 'Join the community.'}
        </p>
      </div>

      <div className="w-full mt-10 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {!isLogin && (
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {!isLogin && (
            <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      <div className="w-full mt-6 space-y-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-zinc-700" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="flex-grow border-zinc-700" />
        </div>

        <button
          onClick={() => alert('Google Sign-In not implemented.')}
          disabled={isLoading}
          className="w-full py-3 font-semibold rounded-lg bg-white text-black flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>

      <div className="mt-8">
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-400 hover:text-white">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

export default AuthView;
