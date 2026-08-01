import {  useState } from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header'; 

 import { useAuthStore } from '@/store/authStore';

 

export default function RootLayout() {
  
  const isAuthenticated = useAuthStore((state:any) => state.isAuthenticated);

  

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header isAuthenticated={isAuthenticated} />
          <main className="flex-1">
            <Outlet />
          </main>
          
          <Footer />
        
      </ThemeProvider>
    </div>
  );
}