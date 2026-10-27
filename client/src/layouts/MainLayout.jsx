import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-ivory-100 text-dark-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#20251F',
            color: '#FFFFFF',
            fontSize: '13px',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#346B54',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#E11D48',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
