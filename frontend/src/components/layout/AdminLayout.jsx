import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-surface-container-low text-on-surface font-body-md antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest shadow-sm border-r border-outline-variant fixed h-full z-40">
        <div className="p-space-md border-b border-outline-variant">
          <Link to="/" className="font-headline-md font-bold text-primary">Neeramoy Admin</Link>
        </div>
        <nav className="p-space-md space-y-2">
          <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-surface-container font-label-md text-on-surface">Dashboard</Link>
          <Link to="/admin/prescriptions" className="block px-3 py-2 rounded-lg hover:bg-surface-container font-label-md text-on-surface">Prescriptions</Link>
          <Link to="/admin/orders" className="block px-3 py-2 rounded-lg hover:bg-surface-container font-label-md text-on-surface">Orders</Link>
          <Link to="/admin/inventory" className="block px-3 py-2 rounded-lg hover:bg-surface-container font-label-md text-on-surface">Inventory</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-grow ml-64 p-space-xl">
        <Outlet />
      </main>
    </div>
  );
};
