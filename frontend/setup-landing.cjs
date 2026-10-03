const fs = require('fs');
const path = require('path');

const files = {
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
  },
  {
    id: 'm2',
    name: 'Sergel 20mg Capsule',
    genericName: 'Esomeprazole Magnesium Trihydrate',
    manufacturer: 'Healthcare Pharma',
    isOtc: true,
    form: 'Capsule',
    packSize: '10',
    price: 70,
    unit: 'Strip',
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7KCYmVX6AzMCtddeVWh3n0xdSdT8jLrl6UgD_9g_7-4IsryUiVmVIsdvCIxXQQGKTaxxpC8gOuIqdwggupWLEU4iFuIpl40eotCJRa6VbmhbqWvy14BLpxcDn3rB_1NSeEG7s7LldxTTz8DzKndBFIreIHBMorxMRb9XzkSpPjB_09irQd93nNPc7HPuts5prUaLYDHIgcNtm5o3FZzIeuCDVVl6RXB2ntmyvAMb3R0cnRA_JCZL9'
  },
  {
    id: 'm3',
    name: 'Monas 10mg Tablet',
    genericName: 'Montelukast Sodium',
    manufacturer: 'Acme Laboratories',
    isOtc: false,
    form: 'Tablet',
    packSize: '10',
    price: 175,
    unit: 'Strip',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeDFEaSDObBgWG7mxSHvgK6s8c859NxIdvWWrvxYar3WjA6_HnEcYy5GCRXaBbm81KYRHKnyjub6Kg2ltQjdV2Wm0x5-GKDthSatrXU1PkqH0MdjBlDFO_op3DKMEBAOWE7EDbmqStL4_aYS9MASteW9zDSlOus4G3KLEdl8ShmqtgRV8mJKJjG81UEA7Ge4Tde0CR81FCQv5fcVDMyJXAUQpe_WnxatKFDnpnsaBZ-LqhkoUa0TGg'
  }
];
`,
  "src/pages/LandingPage.jsx": `import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MedicineCard } from '../components/common/MedicineCard';
import { medicineService } from '../services/medicineService';

export const LandingPage = () => {
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    medicineService.getTopSelling().then(data => setTopSelling(data));
  }, []);

  const handleAddToCart = (medicine) => {
    console.log('Added to cart:', medicine);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background pb-space-2xl pt-space-lg">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-secondary-fixed/15 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="flex items-center gap-space-xs mb-space-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              ডিজিডিএ নিবন্ধিত অনলাইন ডিসপেনসারি • DGDA Licensed
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
              ঢাকায় দ্রুততম ২ ঘণ্টার এক্সপ্রেস ডেলিভারি সচল আছে
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-7 space-y-space-lg">
              <div className="space-y-space-xs">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                  ১০০% আসল ওষুধ, সঠিক তাপমাত্রায় <span className="text-primary underline decoration-secondary-fixed-dim decoration-4 underline-offset-4">২ ঘণ্টায় ডেলিভারি</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Square, Beximco, Incepta ও Renata সরাসরি প্রস্তুতকারক থেকে সংগৃহীত। রেজিস্টার্ড ‘এ’ গ্রেড ফার্মাসিস্টের যাচাইকরণ এবং ইনসুলিনের জন্য বিশেষ ২°C-৮°C কোল্ড-চেইন বক্স সুবিধা।
                </p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[28px]">document_scanner</span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">প্রেসক্রিপশন আপলোড করুন (Quick Rx)</h3>
                      <p className="text-on-surface-variant font-body-sm text-body-sm">ছবি তুলুন বা ফাইল ড্রপ করুন, বাকি কাজ আমাদের ফার্মাসিস্ট করবেন</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-surface-container-high text-primary font-label-sm text-label-sm">১৫ মিনিটে কলব্যাক</span>
                </div>
                <label className="group relative flex flex-col items-center justify-center py-space-xl px-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all text-center">
                  <input accept="image/*,.pdf" className="hidden" id="rxUploadInput" type="file"/>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-space-xs group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">add_a_photo</span>
                  </div>
                  <p className="font-label-lg text-label-lg text-on-surface mb-0.5">
                    <span className="text-primary font-bold">ছবি বা প্রেসক্রিপশন ফাইল এখানে ড্রপ করুন</span> অথবা ব্রাউজ করুন
                  </p>
                  <p className="font-body-sm text-body-sm text-outline">JPG, PNG, PDF সাপোর্ট করে (সর্বোচ্চ ১০ এমবি)</p>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <span>রেজিস্টার্ড বি.ফার্ম ফার্মাসিস্ট ভেরিফিকেশন</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs sm:justify-end">
                    <Button variant="primary">
                      <span className="material-symbols-outlined text-[20px]">upload</span>
                      <span>প্রেসক্রিপশন আপলোড</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 space-y-space-md">
              <div className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-sm overflow-hidden">
                <div className="relative h-64 sm:h-72 w-full rounded-lg overflow-hidden bg-surface-container-high">
                  <img className="w-full h-full object-cover object-center" alt="Clinical setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASfryl3R9GStioOMHXZwTbd1FgxtgRo2jWOWVmMum2LtX37EEF_OIePCj8LXZTK4YBfg45YFbEMlFAELUZJMpRReOdg0Gfw2PEgiZ63RZWocuFyu-9npkCSYr4UItuDQ9rggIo5Gk3qJYLAfywpMhy-SJHSA2jNWHUdsQbXbGXGPogmjmBLlPDBMneJZOR7lruiG7yNy0rGJIesK31zlga1txHgkxTKMav4SSO-gYljhM8UM7QadFL"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent flex flex-col justify-end p-space-md text-surface-bright">
                    <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider">ফার্মেসি মান নিশ্চিতকরণ</span>
                    <p className="font-headline-sm text-headline-sm font-bold text-surface-bright">জিরো-কাউন্টারফিট পলিসি • ১০০% বারকোড স্ক্যানড</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-space-xs mt-space-md">
                  <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                    <div className="font-headline-md text-headline-md text-primary font-bold">৫০,০০০+</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">সফল ডেলিভারি</div>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                    <div className="font-headline-md text-headline-md text-secondary font-bold flex items-center justify-center gap-0.5">
                      ৪.৯ <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">রোগীর রেটিং</div>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                    <div className="font-headline-md text-headline-md text-primary font-bold">১৫ মিনিট</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">ফার্মাসিস্ট কল</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-primary text-on-primary p-space-md rounded-xl shadow-sm">
                <div className="flex items-center gap-space-xs">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm opacity-90">জরুরি প্রেসক্রিপশন হেল্পলাইন (২৪/৭)</div>
                    <div className="font-headline-sm text-headline-sm font-bold tracking-tight">09612-NEERA (63372)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS STRIP */}
      <section className="bg-surface-container-lowest py-space-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">২ ঘণ্টায় এক্সপ্রেস ডেলিভারি</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">ঢাকা সিটির অভ্যন্তরে ধানমন্ডি, গুলশান, মিরপুর, উত্তরায় দ্রুততম হোম ডেলিভারি।</p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">১০০% আসল ওষুধ নিশ্চিত</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">DGDA লাইসেন্সকৃত ডিপো থেকে প্রাপ্ত, ত্রুটিহীন মেয়াদ ও ইনট্যাক্ট স্ট্রিপ গ্যারান্টি।</p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">medical_information</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">বিনামূল্যে ফার্মাসিস্ট পরামর্শ</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">রেজিস্টার্ড ফার্মাসিস্টের মাধ্যমে ওষুধের সঠিক প্রয়োগ ও সাইড-ইফেক্ট গাইডলাইন।</p>
              </div>
            </div>
            <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">১৫% পর্যন্ত ফ্ল্যাট ছাড় + bKash</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">মাসিক ও ক্রনিক ওষুধের প্রেসক্রিপশনে বিশেষ ছাড় ও তাৎক্ষণিক ক্যাশব্যাক।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP SELLING MEDICINES */}
      <section className="py-space-2xl bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-margin-desktop space-y-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">local_pharmacy</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">নিত্যপ্রয়োজনীয় ও প্রেসক্রিপশন মেডিসিন</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">টপ সেলিং নির্ভরযোগ্য ওষুধসমূহ</h2>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-container-lowest shadow-sm">
              <button className="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary font-label-md font-bold">সব ওষুধ (All)</button>
              <button className="px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md">গ্যাস্ট্রিক ও এসিডিটি</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {topSelling.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* CHRONIC CARE BANNER */}
      <section className="py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="relative bg-gradient-to-r from-primary-container to-primary text-on-primary rounded-2xl p-space-xl overflow-hidden shadow-lg">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-2xl"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 space-y-space-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">autorenew</span>
                  নিরাময় মাসিক সাবস্ক্রিপশন প্রোগ্রাম
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight">
                  ডায়াবেটিস বা প্রেশারের ওষুধ ফুরিয়ে যাওয়ার চিন্তা আর নয়!
                </h2>
                <p className="font-body-md text-body-md text-on-primary-container max-w-2xl leading-relaxed">
                  একবার প্রেসক্রিপশন আপলোড করে রিফিল ডেট নির্ধারণ করুন। প্রতি মাসে নির্দিষ্ট দিনে অতিরিক্ত ৫% ছাড় ও জিরো ডেলিভারি চার্জে ওষুধ পৌঁছে যাবে আপনার ঠিকানায়।
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-space-sm lg:items-end">
                <button className="bg-surface-container-lowest text-primary font-label-lg px-space-lg py-space-md rounded-xl hover:bg-surface-container-high transition-all shadow-md font-bold">
                  অটো-রিফিল চালু করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
`,
  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="category/:id" element={<PlaceholderPage title="Category" />} />
        </Route>

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
console.log('Landing page and mock data updated successfully.');
