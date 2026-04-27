import React, { useState, useEffect } from 'react';

interface Props {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@capbon2028.tn');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setSeconds(0);
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  const [serverStatus, setServerStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setServerStatus('ok');
        else setServerStatus('fail');
      } catch (err) {
        setServerStatus('fail');
      }
    };
    checkHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let isPending = true;
    const timeoutId = setTimeout(() => {
        if (isPending) {
            setError('Login is taking longer than expected. Please check your connection or refresh.');
            setIsLoading(false);
        }
    }, 15000);

    try {
      console.log('Admin: Attempting login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      isPending = false;
      clearTimeout(timeoutId);
      
      const text = await response.text();
      let data;
      try {
          data = JSON.parse(text);
      } catch (parseError) {
          console.error('Admin: Failed to parse login response', text);
          throw new Error('invalid server response');
      }

      if (response.ok) {
        console.log('Admin: Login successful, calling onLogin');
        onLogin(data.token);
      } else {
        console.warn('Admin: Login failed', data.error);
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      isPending = false;
      clearTimeout(timeoutId);
      console.error('Admin: Login error', err);
      setError(err.message === 'invalid server response' ? 'Server returned invalid data.' : 'Connection error. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-500 text-sm">Cap Bon 2028 Candidacy Platform</p>
          <div className="mt-2 flex justify-center items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              serverStatus === 'ok' ? 'bg-green-500' : 
              serverStatus === 'fail' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Server {serverStatus === 'ok' ? 'Online' : serverStatus === 'fail' ? 'Offline' : 'Connecting...'}
            </span>
            <span className="text-[8px] text-gray-300">v1.1.0</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p className="font-bold mb-1">Error:</p>
            <p>{error}</p>
            <button 
                onClick={() => { localStorage.removeItem('admin_token'); window.location.reload(); }}
                className="mt-2 text-[10px] uppercase font-bold text-red-600 underline"
            >
                Reset Session & Retry
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-red-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-red-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? `Authenticating (${seconds}s)...` : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
