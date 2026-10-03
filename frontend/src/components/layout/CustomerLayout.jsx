import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-body-md antialiased">
      <Navbar />
      <main className="flex-grow w-full pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
