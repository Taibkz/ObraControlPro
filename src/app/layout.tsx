'use client';

import React, { useState } from 'react';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { QuickLogModal } from '@/components/ui/QuickLogModal';
import LoginPage from '@/app/login/page';
import { Building2 } from 'lucide-react';

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute w-96 h-96 bg-blue-600/15 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
        <div className="absolute w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/20 animate-pulse">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-white text-base font-black tracking-wider uppercase">Decointeriores Málaga</p>
            <p className="text-blue-400 text-xs mt-0.5 font-medium">Iniciando sistema de gestión...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppProvider>
      <Navbar onOpenQuickLog={() => setIsQuickLogOpen(true)} />
      <div className="flex flex-1 max-w-7xl w-full mx-auto pb-24 md:pb-8">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNav onOpenQuickLog={() => setIsQuickLogOpen(true)} />
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
      />
    </AppProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <title>Decointeriores Málaga - Gestión Integral de Obras</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="Sistema de gestión de obras, materiales y personal de Decointeriores Málaga." />
        <meta name="theme-color" content="#0a1526" />
      </head>
      <body className="bg-slate-50/80 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}