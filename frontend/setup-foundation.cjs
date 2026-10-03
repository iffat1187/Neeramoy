const fs = require('fs');
const path = require('path');

const files = {
  "src/components/common/Button.jsx": `import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "font-label-lg text-label-lg px-space-md py-space-sm rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm";
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container",
    secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high",
    outline: "border border-outline text-on-surface hover:bg-surface-container-low"
  };

  return (
    <button className={\`\${baseClasses} \${variants[variant]} \${className}\`} {...props}>
      {children}
    </button>
  );
};
`,
  "src/components/common/Badge.jsx": `import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses = "px-2 py-0.5 rounded-md font-label-sm text-label-sm font-bold flex items-center gap-1";
  const variants = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary-container/40 text-on-secondary-container",
    tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
    surface: "bg-surface-container text-on-surface-variant"
  };

  return (
    <span className={\`\${baseClasses} \${variants[variant]} \${className}\`}>
      {children}
    </span>
  );
};
`,
  "src/components/common/Card.jsx": `import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  const hoverClass = hover ? 'hover:shadow-md transition-shadow' : '';
  return (
    <div className={\`bg-surface-container-lowest rounded-xl p-space-md shadow-sm \${hoverClass} \${className}\`} {...props}>
      {children}
    </div>
  );
};
`,
  "src/components/common/Input.jsx": `import React from 'react';

export const Input = ({ icon, className = '', ...props }) => {
  return (
    <div className={\`relative flex items-center w-full bg-surface-container-low rounded-xl px-space-md py-space-xs transition-all focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)] \${className}\`}>
      {icon && <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs shrink-0">{icon}</span>}
      <input 
        className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline-variant"
        {...props} 
      />
    </div>
  );
};
`,
  "src/components/common/MedicineCard.jsx": `import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export const MedicineCard = ({ medicine, onAddToCart }) => {
  return (
    <Card className="flex flex-col justify-between space-y-space-md">
      <div>
        <div className="flex items-center justify-between gap-space-xs mb-space-sm">
          {medicine.isOtc ? (
            <Badge variant="secondary"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> OTC মেডিসিন</Badge>
          ) : (
            <Badge variant="tertiary"><span className="material-symbols-outlined text-[14px]">prescriptions</span> Rx Required</Badge>
          )}
          <Badge variant="surface">{medicine.manufacturer}</Badge>
        </div>
        
        <div className="flex items-start gap-space-md">
          <div className="w-20 h-20 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
            <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{medicine.name}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{medicine.genericName}</p>
            <div className="flex items-center gap-1 mt-1 text-[12px] text-outline">
              <span>{medicine.form}</span> • <span>প্যাক: {medicine.packSize}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-label-sm text-label-sm text-on-surface font-bold">{medicine.rating}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-space-sm space-y-space-sm">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-price-lg text-price-lg text-primary">৳ {medicine.price}</span>
            <span className="text-body-sm font-body-sm text-outline">/ {medicine.unit}</span>
          </div>
        </div>
        <Button className="w-full" onClick={() => onAddToCart(medicine)}>
          <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          <span>কার্টে যোগ করুন</span>
        </Button>
      </div>
    </Card>
  );
};
`,
  "src/components/layout/Navbar.jsx": `import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../common/Input';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="bg-primary text-on-primary py-space-xs text-body-sm font-body-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-label-sm text-label-sm tracking-wide">DGDA Licensed</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            <span>24/7 Helpline: <strong>09612-NEERA</strong></span>
          </div>
        </div>
      </div>
      
      <div className="h-20 max-w-7xl mx-auto px-margin-desktop flex items-center justify-between gap-space-lg">
        <Link to="/" className="flex items-center gap-space-md shrink-0">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">নিরাময়</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Healthcare</span>
          </div>
        </Link>
        
        <div className="flex-1 max-w-2xl hidden md:block">
          <Input icon="search" placeholder="Search medicines..." />
        </div>
        
        <div className="flex items-center gap-space-md shrink-0">
          <Link to="/admin" className="text-on-surface-variant hover:text-primary font-label-md">Admin Portal</Link>
        </div>
      </div>
    </header>
  );
};
`,
  "src/components/layout/Footer.jsx": `import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container text-on-surface-variant pt-space-2xl pb-space-xl mt-space-2xl">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl pb-space-lg">
          <div>
            <h3 className="font-headline-sm font-bold text-primary mb-2">নিরাময় হেলথকেয়ার</h3>
            <p className="font-body-sm text-on-surface-variant">Government licensed digital pharmacy platform ensuring 100% genuine medicines.</p>
          </div>
          <div>
            <h4 className="font-headline-sm font-bold text-on-surface mb-2">Contact</h4>
            <p className="font-body-sm">09612-NEERA (63372)</p>
          </div>
        </div>
        <div className="border-t border-outline-variant pt-4 text-center text-[11px]">
          © 2024 Neeramoy Healthcare Bangladesh Ltd.
        </div>
      </div>
    </footer>
  );
};
`,
  "src/components/layout/CustomerLayout.jsx": `import React from 'react';
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
`,
  "src/components/layout/AdminLayout.jsx": `import React from 'react';
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
`,
  "src/pages/PlaceholderPage.jsx": `import React from 'react';

export const PlaceholderPage = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl">
      <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-space-md">{title}</h1>
      <p className="font-body-lg text-on-surface-variant">This page is currently under construction. Please check back later.</p>
    </div>
  );
};
`,
  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<PlaceholderPage title="Neeramoy Customer Portal" />} />
          <Route path="category/:id" element={<PlaceholderPage title="Category" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PlaceholderPage title="Admin Dashboard" />} />
          <Route path="prescriptions" element={<PlaceholderPage title="Prescription Review" />} />
          <Route path="orders" element={<PlaceholderPage title="Order Management" />} />
          <Route path="inventory" element={<PlaceholderPage title="Inventory Management" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`,
  "src/main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
  "src/mockData/medicines.js": `export const MOCK_MEDICINES = [
  {
    id: 'm1',
    name: 'Napa Extra 500mg/65mg',
    genericName: 'Paracetamol + Caffeine',
    manufacturer: 'Beximco',
    isOtc: true,
    form: 'Tablet',
    packSize: '12',
    price: 36,
    unit: 'Strip',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf8QgTeefksxI4jClTU-PDm5OQGVzeqSviWKknUQk2hH5iwHllB_t5r66_8hNU2NhKf8S2XjuM3BefCKC0GCSUX9L8XVd-EYMaJ8JwU5NXz9caJugnojSHHG0KPp2KiwJ7iZ09un8E53fvU7vNufU9X3dKh4YjZkZJWIb_m6hwU39LDq6QaRO_pV86Q22FbrHsX90z9msuDxPMvrJera8fBrFq3NY17SYtrnRNfvCihcC4rvsIMXUk'
  }
];
`,
  "src/services/apiClient.js": `// Basic API Client foundation for future Spring Boot integration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = {
  async get(endpoint) {
    // const response = await fetch(\`\${BASE_URL}\${endpoint}\`);
    // return response.json();
    console.log(\`[MOCK API] GET \${endpoint}\`);
    return null;
  }
};
`,
  "src/services/medicineService.js": `import { MOCK_MEDICINES } from '../mockData/medicines';
import { apiClient } from './apiClient';

export const medicineService = {
  async getTopSelling() {
    // In future: return apiClient.get('/medicines/top-selling');
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDICINES), 300));
  }
};
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join('D:\\Neeramoy\\frontend', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
console.log('Foundation created successfully.');
