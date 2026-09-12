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
import { HardHat } from 'lucide-react';

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl animate-pulse">
            <HardHat className="w-8 h-8" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Cargando ObraControl Pro...</p>
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
      <div className="flex flex-1 max-w-7xl w-full mx-auto pb-20 md:pb-6">
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
    <html lang="es">
      <head>
        <title>ObraControl Pro - Gestion de Obras, Materiales y Personal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="Aplicacion de gestion de obras, calculo de materiales con 5% de merma, control de salarios y finanzas para autonomos y pequenas constructoras." />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}