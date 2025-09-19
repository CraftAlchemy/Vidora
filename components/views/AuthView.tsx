
import React, { useState } from 'react';
import { GoogleIcon } from '../icons/Icons';
import api from '../../services/api';

interface AuthViewProps {
  onLoginSuccess: (token: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (isLogin) {
      try {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        onLoginSuccess(res.data.token);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Login failed');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        const res = await api.post('/auth/register', { email, username, password, name });
        localStorage.setItem('token', res.data.token);
        onLoginSuccess(res.data.token);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Registration failed');
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-900 text-white flex flex-col justify-center items-center p-6 max-w-md mx-auto">
      <div className="w-full text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
          VIDORA
        </h1>
        <p className="text-gray-400 mt-2">
          {isLogin ? 'Welcome back!' : 'Join the community.'}
        </p>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="w-full mt-10 space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
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

      <div className="w-full mt-6 space-y-4">
        <button
          onClick={handleAuth}
          className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform hover:scale-105 transition-transform"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-zinc-700" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="flex-grow border-zinc-700" />
        </div>

        <button
          // onClick={onLoginSuccess} // Google login not implemented yet
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