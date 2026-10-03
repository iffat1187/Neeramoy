const fs = require('fs');
const path = require('path');

const files = {
  "src/mockData/medicines.js": `export const MOCK_MEDICINES = [
  {
    id: 'm1',
    name: 'Napa Extra',
    genericName: 'Paracetamol 500mg + Caffeine 65mg',
    manufacturer: 'Beximco Pharmaceuticals',
    isOtc: true,
    form: 'Tablet',
    packSize: '12',
    price: 36,
    originalPrice: 40,
    discount: 10,
    unit: 'Strip',
    rating: 4.9,
    category: 'fever',
    inStock: true,
    description: 'Napa Extra is a combination of Paracetamol and Caffeine. Paracetamol is a fast-acting analgesic and antipyretic. Caffeine acts to enhance the pain-relieving effect of Paracetamol.',
    indications: ['Headache', 'Migraine', 'Toothache', 'Neuralgia', 'Feverishness', 'Period pain', 'Sore throat'],
    howToUse: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours. Swallow with a glass of water.',
    safetyInfo: 'Do not take with any other paracetamol-containing products. Consult your doctor if symptoms persist for more than 3 days. Avoid excessive caffeine intake (e.g. coffee, tea) while taking this product.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf8QgTeefksxI4jClTU-PDm5OQGVzeqSviWKknUQk2hH5iwHllB_t5r66_8hNU2NhKf8S2XjuM3BefCKC0GCSUX9L8XVd-EYMaJ8JwU5NXz9caJugnojSHHG0KPp2KiwJ7iZ09un8E53fvU7vNufU9X3dKh4YjZkZJWIb_m6hwU39LDq6QaRO_pV86Q22FbrHsX90z9msuDxPMvrJera8fBrFq3NY17SYtrnRNfvCihcC4rvsIMXUk'
  },
  {
    id: 'm2',
    name: 'Maxpro 20',
    genericName: 'Esomeprazole Magnesium 20mg',
    manufacturer: 'Square Pharmaceuticals',
    isOtc: true,
    form: 'Capsule',
    packSize: '10',
    price: 70,
    originalPrice: 70,
    discount: 0,
    unit: 'Strip',
    rating: 4.8,
    category: 'gastric',
    inStock: true,
    description: 'Maxpro is a proton pump inhibitor (PPI) that suppresses gastric acid secretion by specific inhibition of the H+/K+-ATPase in the gastric parietal cell.',
    indications: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis', 'Zollinger-Ellison syndrome', 'Peptic ulcer disease'],
    howToUse: 'Take 1 capsule daily before a meal, preferably in the morning. Swallow whole, do not chew or crush.',
    safetyInfo: 'Inform your doctor if you have severe liver disease. Long-term use may increase the risk of bone fractures and Vitamin B12 deficiency.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQj3-lgFODFI5vzOkC4eapSi8EnH7Nb4M5OUcW69JUvPSPCmf7nRyL_hqSX_NHnikYAurvlLX6Qf6_zLn8f3f222UZya3RloN3579elgODymD0d9vZgOTp3MLu2R-Ma2o2APRT4kKjiZDY_9mQeD9hsxRUx6wr3MBuFfywXsSnyj_KkC_P96CwTtgWp_Nyxq05T9drSiozNdLu9jMasnthMq5A0Jn6QBebJ3jrIgQQn0miKJb-c8Vs'
  },
  {
    id: 'm3',
    name: 'Monas 10',
    genericName: 'Montelukast Sodium 10mg',
    manufacturer: 'The ACME Laboratories',
    isOtc: false,
    form: 'Tablet',
    packSize: '10',
    price: 175,
    originalPrice: 185,
    discount: 5,
    unit: 'Strip',
    rating: 4.9,
    category: 'respiratory',
    inStock: true,
    description: 'Monas acts as a leukotriene receptor antagonist. It blocks the action of leukotrienes, which cause narrowing and swelling of airways in the lungs.',
    indications: ['Prophylaxis and chronic treatment of asthma', 'Relief of symptoms of allergic rhinitis (seasonal and perennial)'],
    howToUse: 'Adults: 1 tablet daily in the evening. For allergic rhinitis, the time of administration may be individualized.',
    safetyInfo: 'Not intended for relief of acute asthma attacks. May cause neuropsychiatric events in rare cases (e.g., agitation, sleep disturbances).',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeDFEaSDObBgWG7mxSHvgK6s8c859NxIdvWWrvxYar3WjA6_HnEcYy5GCRXaBbm81KYRHKnyjub6Kg2ltQjdV2Wm0x5-GKDthSatrXU1PkqH0MdjBlDFO_op3DKMEBAOWE7EDbmqStL4_aYS9MASteW9zDSlOus4G3KLEdl8ShmqtgRV8mJKJjG81UEA7Ge4Tde0CR81FCQv5fcVDMyJXAUQpe_WnxatKFDnpnsaBZ-LqhkoUa0TGg'
  },
  {
    id: 'm4',
    name: 'Savlon Antiseptic',
    genericName: 'Chlorhexidine Gluconate + Cetrimide',
    manufacturer: 'ACI Limited',
    isOtc: true,
    form: 'Liquid',
    packSize: '1',
    price: 110,
    originalPrice: 110,
    discount: 0,
    unit: 'Bottle',
    rating: 4.7,
    category: 'hygiene',
    inStock: true,
    description: 'Savlon Liquid Antiseptic contains two active ingredients: Chlorhexidine Gluconate and Cetrimide. It is used for first aid, personal hygiene, and general household cleaning.',
    indications: ['First aid (cuts, grazes, bites)', 'Personal hygiene (bath, dandruff)', 'Household cleaning'],
    howToUse: 'Dilute before use. For first aid: 1 capful in a glass of water. For bathing: 1-2 capfuls in bath water.',
    safetyInfo: 'For external use only. Avoid contact with eyes and ears. Keep out of reach of children.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7KCYmVX6AzMCtddeVWh3n0xdSdT8jLrl6UgD_9g_7-4IsryUiVmVIsdvCIxXQQGKTaxxpC8gOuIqdwggupWLEU4iFuIpl40eotCJRa6VbmhbqWvy14BLpxcDn3rB_1NSeEG7s7LldxTTz8DzKndBFIreIHBMorxMRb9XzkSpPjB_09irQd93nNPc7HPuts5prUaLYDHIgcNtm5o3FZzIeuCDVVl6RXB2ntmyvAMb3R0cnRA_JCZL9'
  },
  {
    id: 'm5',
    name: 'Accu-Chek Instant',
    genericName: 'Blood Glucose Meter Kit',
    manufacturer: 'Roche Diabetes Care',
    isOtc: true,
    form: 'Device',
    packSize: '1',
    price: 1650,
    originalPrice: 1800,
    discount: 8,
    unit: 'Kit',
    rating: 4.9,
    category: 'devices',
    inStock: false,
    description: 'Accu-Chek Instant meter makes testing blood sugar easy. It features a target range indicator that gives visual reassurance if your blood glucose values are high, low or in-range.',
    indications: ['Blood glucose monitoring for diabetics'],
    howToUse: 'Insert a test strip, apply a small blood drop to the yellow edge of the test strip, and read the result in less than 4 seconds.',
    safetyInfo: 'Store test strips in their original vial. Do not use expired test strips. Keep the meter clean and away from extreme temperatures.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlQKws2uu6N05JRF-qHVdhM9WY_djUwbSdt92sCwqU7XEY---tMRMHM5LS8f7ROwnQ7jHbQrcZsLcuUJX79Rf5L1WW3E0q6KesxEEO8sZZa9FoWW7LzKQpdMZDGIr0g2P0IhT0bvtT42hC1yJehYJa8W2VPSkfjnKdxfiT2DxAa3bC2RZXtjIrx8mu6SPzQMrVrEiH7V2zoyR_IiglKkdnpc3PDUSopc6bvEts7OFer-ZueeT_cdry'
  },
  {
    id: 'm6',
    name: 'Seclo 20',
    genericName: 'Omeprazole BP 20mg',
    manufacturer: 'Square Pharmaceuticals',
    isOtc: true,
    form: 'Capsule',
    packSize: '10',
    price: 60,
    originalPrice: 60,
    discount: 0,
    unit: 'Strip',
    rating: 4.7,
    category: 'gastric',
    inStock: true,
    description: 'Seclo is a proton pump inhibitor used for the treatment of conditions caused by excess stomach acid.',
    indications: ['Gastric ulcer', 'Duodenal ulcer', 'GERD', 'Zollinger-Ellison syndrome'],
    howToUse: 'Take 1 capsule 30 minutes before breakfast.',
    safetyInfo: 'Avoid in patients with known hypersensitivity to omeprazole. May mask symptoms of gastric cancer.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuRLT6bze253pAy47pamU_u64wCAz50JPJx-uWBuzfrGz75RZq24XX2Sb7FSbGrqiWbhgGR1Mz9RPCZv1pkT2bcY_fVBbRU5hbIA0eOvsQlWWVhzN4aOzc8AUwojXuBvGYVycyTNZV8pJ8i5MBXAdF_-xhNz82wcDHGaEbPrGmt6Gvrxx0YmW_vC3UwRAr2A4awkSKVvBRSM-MMug1pZVbhdmTzPpPGEN6W0C5zQtmvlEuNHxmXnF3'
  }
];
`,
  "src/context/CartContext.jsx": `import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity: quantity }];
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
`,
  "src/components/common/MedicineCard.jsx": `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export const MedicineCard = ({ medicine, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between space-y-space-md group">
      <div className="cursor-pointer" onClick={() => navigate(\`/product/\${medicine.id}\`)}>
        <div className="flex items-center justify-between gap-space-xs mb-space-sm">
          {medicine.isOtc ? (
            <Badge variant="secondary"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> OTC মেডিসিন</Badge>
          ) : (
            <Badge variant="tertiary"><span className="material-symbols-outlined text-[14px]">prescriptions</span> Rx Required</Badge>
          )}
          <Badge variant="surface" className="truncate max-w-[120px]">{medicine.manufacturer}</Badge>
        </div>
        
        <div className="flex items-start gap-space-md">
          <div className="w-20 h-20 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
            <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate group-hover:text-primary transition-colors">{medicine.name}</h3>
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
          {medicine.discount > 0 && (
            <span className="text-[11px] line-through text-outline">৳ {medicine.originalPrice}</span>
          )}
        </div>
        <Button 
          className="w-full" 
          disabled={medicine.inStock === false}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(medicine);
          }}
        >
          <span className="material-symbols-outlined text-[18px]">
            {medicine.inStock === false ? 'block' : 'add_shopping_cart'}
          </span>
          <span>{medicine.inStock === false ? 'Out of Stock' : 'কার্টে যোগ করুন'}</span>
        </Button>
      </div>
    </Card>
  );
};
`,
  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="category/:id" element={<SearchResultsPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<PlaceholderPage title="Shopping Cart" />} />
            <Route path="checkout" element={<PlaceholderPage title="Checkout" />} />
            <Route path="login" element={<PlaceholderPage title="Login / Authentication" />} />
            <Route path="search" element={<SearchResultsPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<PlaceholderPage title="Admin Dashboard" />} />
            <Route path="prescriptions" element={<PlaceholderPage title="Prescription Review" />} />
            <Route path="orders" element={<PlaceholderPage title="Order Management" />} />
            <Route path="inventory" element={<PlaceholderPage title="Inventory Management" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
`,
  "src/pages/ProductDetailsPage.jsx": `import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MedicineCard } from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    // Simulate API fetch
    medicineService.getTopSelling().then(data => {
      const found = data.find(m => m.id === id);
      if (found) {
        setProduct(found);
        // Get related products (mock: same category or first 4)
        const related = data.filter(m => m.category === found.category && m.id !== found.id).slice(0, 4);
        if (related.length < 4) {
          const fillers = data.filter(m => m.id !== found.id && !related.find(r => r.id === m.id)).slice(0, 4 - related.length);
          setRelatedProducts([...related, ...fillers]);
        } else {
          setRelatedProducts(related);
        }
      } else {
        setProduct(null); // Not found
      }
      setIsLoading(false);
      setQuantity(1);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl animate-pulse">
        <div className="h-6 w-1/3 bg-surface-container-low rounded mb-space-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          <div className="h-96 bg-surface-container-low rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-surface-container-low rounded"></div>
            <div className="h-6 w-1/2 bg-surface-container-low rounded"></div>
            <div className="h-20 w-full bg-surface-container-low rounded"></div>
            <div className="h-12 w-1/3 bg-surface-container-low rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-space-2xl min-h-[60vh]">
        <span className="material-symbols-outlined text-[64px] text-outline mb-4">medication</span>
        <h2 className="font-headline-lg font-bold text-on-surface">Product Not Found</h2>
        <p className="font-body-md text-on-surface-variant mt-2 mb-6">The requested medicine or product could not be found.</p>
        <Button onClick={() => navigate('/search')}>Browse Medicines</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 md:right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
          <span className="font-label-md">Added {quantity} item(s) to Cart!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer flex items-center" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-[16px] mr-1">home</span> হোম
            </span>
            <span className="text-outline-variant">/</span>
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(\`/category/\${product.category}\`)}>
              {product.category.toUpperCase()}
            </span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Hero */}
      <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-5 p-space-xl flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/20 bg-surface">
              <div className="w-full max-w-sm aspect-square bg-surface-container-low rounded-xl flex items-center justify-center p-space-lg mb-space-md overflow-hidden relative">
                {!product.inStock && (
                  <div className="absolute top-4 right-4 bg-error text-on-error px-2 py-1 rounded font-label-sm font-bold z-10 shadow-sm">
                    Out of Stock
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-2 py-1 rounded font-label-sm font-bold z-10 shadow-sm">
                    {product.discount}% OFF
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex items-center gap-space-sm w-full max-w-sm">
                <div className="w-16 h-16 rounded-lg border-2 border-primary bg-surface-container-lowest p-1 cursor-pointer">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                {/* Mock thumbnails */}
                <div className="w-16 h-16 rounded-lg border border-outline-variant/30 bg-surface-container-low p-1 cursor-pointer opacity-70 hover:opacity-100">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* Right: Details & Action */}
            <div className="lg:col-span-7 p-space-xl flex flex-col justify-between">
              <div className="space-y-space-md">
                <div className="flex items-center gap-space-xs">
                  {product.isOtc ? (
                    <Badge variant="secondary"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> OTC Medicine</Badge>
                  ) : (
                    <Badge variant="tertiary"><span className="material-symbols-outlined text-[14px]">prescriptions</span> Rx Required</Badge>
                  )}
                  <Badge variant="surface" className="border border-outline-variant/30">{product.form}</Badge>
                </div>
                
                <div>
                  <h1 className="font-headline-lg font-bold text-on-surface mb-1">{product.name}</h1>
                  <p className="font-body-lg text-on-surface-variant mb-2">Generic: <span className="font-medium text-on-surface">{product.genericName}</span></p>
                  <p className="font-label-md text-outline uppercase tracking-wider">{product.manufacturer}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-lg font-bold text-on-surface">{product.rating}</span>
                  <span className="text-outline text-body-sm">(124 Reviews)</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="font-headline-xl font-bold text-primary">৳ {product.price}</span>
                    {product.discount > 0 && (
                      <span className="font-headline-sm text-outline line-through mb-1">৳ {product.originalPrice}</span>
                    )}
                  </div>
                  <p className="font-body-sm text-on-surface-variant">Price per {product.unit} (Pack size: {product.packSize}s)</p>
                </div>
              </div>

              <div className="mt-space-xl bg-surface-container-low p-space-md rounded-xl space-y-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-on-surface-variant">Quantity:</span>
                  <div className="flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/50">
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center font-label-lg font-bold">
                      {quantity}
                    </span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock || quantity >= 10}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 py-3 text-[16px] bg-surface-container-lowest" 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <span className="material-symbols-outlined mr-2">add_shopping_cart</span>
                    Add to Cart
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1 py-3 text-[16px] shadow-md" 
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                  >
                    Buy Now
                  </Button>
                </div>
                
                {!product.isOtc && (
                  <div className="flex items-start gap-2 pt-2 text-[12px] text-tertiary">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <p>A valid prescription is required to process the order for this medicine. You can upload it during checkout.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Details Section */}
      <div className="max-w-7xl mx-auto px-margin-desktop mb-space-xl">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-outline-variant/30 no-scrollbar">
            {[
              { id: 'description', label: 'Description' },
              { id: 'indications', label: 'Uses / Indications' },
              { id: 'dosage', label: 'How to Use' },
              { id: 'safety', label: 'Safety Information' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`px-space-lg py-4 font-label-md whitespace-nowrap transition-colors border-b-2 \${activeTab === tab.id ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}\`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-space-xl min-h-[200px]">
            {activeTab === 'description' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">About {product.name}</h3>
                <p className="leading-relaxed">{product.description || \`\${product.name} is a reliable medication manufactured by \${product.manufacturer}. It contains \${product.genericName} and is primarily used for specific indications as directed by a physician.\`}</p>
                <div className="bg-surface-container-low p-4 rounded-xl mt-6 inline-block">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Manufacturer</p>
                  <p className="font-label-md font-bold text-on-surface">{product.manufacturer}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'indications' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">Indications</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {(product.indications || ['As directed by the physician.']).map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'dosage' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">Dosage & Administration</h3>
                <p className="leading-relaxed">{product.howToUse || 'Please follow the dosage instructions provided by your registered physician or as directed on the packaging.'}</p>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-error">Safety & Precautions</h3>
                <div className="flex items-start gap-3 bg-error-container/30 p-4 rounded-xl text-on-surface">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  <p className="leading-relaxed">{product.safetyInfo || 'Consult your doctor before starting any new medication. Keep out of reach of children. Store in a cool, dry place.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-lg">
            <h2 className="font-headline-lg font-bold text-on-surface">Related Medicines</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
            {relatedProducts.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
console.log('Product Details page implemented.');
