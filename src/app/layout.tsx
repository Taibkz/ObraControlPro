'use client';

import React, { useState } from 'react';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { QuickLogModal } from '@/components/ui/QuickLogModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  return (
    <html lang="es">
      <head>
        <title>ObraControl Pro - Gestión de Obras, Materiales y Personal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="description" content="Aplicación de gestión de obras, cálculo de materiales con 5% de merma, control de salarios y finanzas para autónomos y pequeñas constructoras." />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
