'use client';

import React, { useState } from 'react';
import { HardHat, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Mode = 'login' | 'forgot';

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      if (error.includes('Invalid login credentials') || error.includes('invalid_credentials')) {
        setError('Correo o contrasena incorrectos. Comprueba tus datos.');
      } else if (error.includes('Email not confirmed')) {
        setError('Debes confirmar tu correo electronico antes de iniciar sesion.');
      } else {
        setError(error);
      }
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess('Te hemos enviado un enlace de recuperacion a ' + email + '. Revisa tu bandeja de entrada (y el spam).');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <HardHat className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            ObraControl <span className="text-amber-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Gestion de Obras, Materiales y Personal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header card */}
          <div className="bg-slate-900 px-6 py-5">
            {mode === 'login' ? (
              <h2 className="text-white font-bold text-lg">Iniciar sesion</h2>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-white font-bold text-lg">Recuperar contrasena</h2>
              </div>
            )}
          </div>

          <div className="p-6">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo electronico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contrasena
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  {loading ? 'Iniciando sesion...' : 'Entrar'}
                </button>

                {/* Forgot */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs text-slate-500 hover:text-amber-600 font-medium transition-colors"
                  >
                    ¿Olvidaste tu contrasena?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Introduce tu correo y te enviaremos un enlace para crear una nueva contrasena.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo electronico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || Boolean(success)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  {loading ? 'Enviando...' : 'Enviar enlace de recuperacion'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          ObraControl Pro &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}