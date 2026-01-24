import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Lock, User, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(); // Simulate login
    }, 1500);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-10 border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif text-white">Admin Dashboard</h2>
            <p className="text-blue-100/50 text-sm mt-1">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-100/70 uppercase tracking-wider ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-100/70 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="password" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-white text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Accessing...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <span className="text-xs text-white/20">System Ver: 2.1.0 • /admin/index.html</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
