import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Banner from './components/Banner';
import ProductGrid from './components/ProductGrid';
import AdminPanel from './components/AdminPanel';
import QuickActions from './components/QuickActions';
import Footer from './components/Footer';

function AppContent() {
  const { state } = useApp();

  if (state.isAdminMode) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          <Banner />
          <ProductGrid />
        </div>
      </main>

      <Footer />
      <QuickActions />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;