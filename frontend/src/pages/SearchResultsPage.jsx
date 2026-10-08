import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MedicineCard } from '../components/common/MedicineCard';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

export const SearchResultsPage = () => {
  const { id: categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const urlManufacturer = searchParams.get('manufacturer');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    category: categoryId || 'all',
    manufacturer: urlManufacturer,
    maxPrice: 1500
  });
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      manufacturer: searchParams.get('manufacturer')
    }));
  }, [searchParams]);

  const handleManufacturerChange = (mfg) => {
    const newParams = new URLSearchParams(searchParams);
    if (!mfg) {
      newParams.delete('manufacturer');
    } else {
      newParams.set('manufacturer', mfg);
    }
    setSearchParams(newParams);
    setFilters(prev => ({ ...prev, manufacturer: mfg }));
  };

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    // Fetch all mock data
    medicineService.getTopSelling().then(data => {
      let results = [...data];
      
      // Apply Search Query if any
      if (query) {
        results = results.filter(m => 
          m.name.toLowerCase().includes(query.toLowerCase()) || 
          m.genericName.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setMedicines(results);
      applyFilters(results, filters, sortBy);
      setIsLoading(false);
    });
  }, [categoryId, query]);

  useEffect(() => {
    applyFilters(medicines, filters, sortBy);
  }, [filters, sortBy, medicines]);

  const applyFilters = (data, currentFilters, sortMode) => {
    let filtered = [...data];
    
    // Type Filter (Rx/OTC)
    if (currentFilters.type === 'otc') {
      filtered = filtered.filter(m => m.isOtc);
    } else if (currentFilters.type === 'rx') {
      filtered = filtered.filter(m => !m.isOtc);
    }
    
    // Price Filter
    filtered = filtered.filter(m => m.price <= currentFilters.maxPrice);
    
    // Category Filter (Mock implementation based on generic grouping or explicit category if added)
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(m => m.category === currentFilters.category);
    }

    // Manufacturer Filter
    if (currentFilters.manufacturer) {
      filtered = filtered.filter(m => m.manufacturer === currentFilters.manufacturer);
    }
    
    // Sort
    if (sortMode === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortMode === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredMedicines(filtered);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('manufacturer');
    setSearchParams(newParams);

    setFilters({
      type: 'all',
      category: categoryId || 'all',
      manufacturer: null,
      maxPrice: 1500
    });
    setSortBy('popularity');
  };

  const getPageTitle = () => {
    if (query) return `Search results for "${query}"`;
    if (categoryId) return `Category: ${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`;
    return 'All Medicines';
  };

  const uniqueManufacturers = [null, 'Beximco Pharmaceuticals', 'Square Pharmaceuticals', 'The ACME Laboratories', 'ACI Limited', 'Roche Diabetes Care'];

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Sub-header Breadcrumb & Title */}
      <div className="w-full bg-surface-container-low py-space-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mb-space-xs">
            <span className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>হোম (Home)</span>
            </span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-label-md">{getPageTitle()}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs">
            <div>
              <div className="flex items-center gap-space-sm mb-1">
                <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span> DGDA ভেরিফায়েড
                </span>
              </div>
              <h1 className="font-headline-lg text-on-surface tracking-tight font-bold">
                {getPageTitle()}
              </h1>
            </div>
            {/* Quick Rx Upload */}
            <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-md text-on-surface font-bold">প্রেসক্রিপশন আপলোড</span>
                <span className="text-[11px] text-on-surface-variant">ফার্মাসিস্ট ওষুধ সিলেক্ট করবেন</span>
              </div>
              <Button onClick={() => navigate('/login')} className="ml-space-xs py-1.5 px-3">আপলোড</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-margin-desktop py-space-lg w-full">
        {/* Filter & Sort Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-md text-on-surface font-bold pr-space-xs">
              {filteredMedicines.length}টি পণ্য প্রদর্শিত
            </span>
            <Button variant="outline" className="md:hidden py-1 px-3 text-body-sm" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
              <span className="material-symbols-outlined text-[18px]">tune</span> ফিল্টার
            </Button>
            {(filters.type !== 'all' || filters.manufacturer || filters.maxPrice < 1500) && (
              <button onClick={clearFilters} className="text-primary font-label-sm hover:underline ml-space-xs">
                সব ফিল্টার মুছুন
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-space-sm shrink-0">
            <label className="text-body-sm text-on-surface-variant">সাজান (Sort):</label>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-surface-container-lowest text-on-surface font-label-md py-1.5 pl-3 pr-8 rounded-lg shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="popularity">জনপ্রিয়তা (Popularity)</option>
                <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                <option value="price-desc">মূল্য: বেশি থেকে কম</option>
                <option value="rating">গ্রাহক রেটিং</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-outline text-[18px]">expand_more</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg relative">
          
          {/* Mobile Filter Overlay logic handled via CSS classes for simplicity */}
          <aside className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-3 space-y-space-md z-40 bg-surface lg:bg-transparent p-4 lg:p-0 absolute lg:relative top-0 left-0 w-full lg:w-auto shadow-lg lg:shadow-none border lg:border-none border-outline-variant/20 rounded-xl`} >
            
            {/* Close Button for mobile */}
            <div className="flex lg:hidden justify-between items-center mb-4">
              <h2 className="font-headline-sm font-bold">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}><span className="material-symbols-outlined">close</span></button>
            </div>

            {/* Type Filter */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <h2 className="font-headline-sm font-bold text-on-surface mb-space-sm flex items-center justify-between">
                <span>প্রেসক্রিপশন শর্ত (Type)</span>
                <span className="material-symbols-outlined text-[18px] text-outline">tune</span>
              </h2>
              <div className="space-y-space-xs">
                <label className="flex items-center gap-space-xs cursor-pointer text-body-sm text-on-surface">
                  <input type="radio" name="rx_filter" checked={filters.type === 'all'} onChange={() => setFilters({...filters, type: 'all'})} className="w-4 h-4 text-primary accent-primary" />
                  <span>সকল ওষুধ (All)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer text-body-sm text-on-surface">
                  <span className="flex items-center gap-space-xs">
                    <input type="radio" name="rx_filter" checked={filters.type === 'otc'} onChange={() => setFilters({...filters, type: 'otc'})} className="w-4 h-4 text-primary accent-primary" />
                    <span>OTC (প্রেসক্রিপশন ছাড়াই)</span>
                  </span>
                  <span className="text-[11px] bg-secondary-container text-on-secondary-container dark:bg-secondary/15 dark:text-secondary px-1.5 py-0.5 rounded font-bold">OTC</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer text-body-sm text-on-surface">
                  <span className="flex items-center gap-space-xs">
                    <input type="radio" name="rx_filter" checked={filters.type === 'rx'} onChange={() => setFilters({...filters, type: 'rx'})} className="w-4 h-4 text-primary accent-primary" />
                    <span>প্রেসক্রিপশন আবশ্যক (Rx)</span>
                  </span>
                  <span className="text-[11px] bg-tertiary-container/15 text-tertiary px-1.5 py-0.5 rounded font-bold">Rx</span>
                </label>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <h2 className="font-headline-sm font-bold text-on-surface mb-space-sm">স্বাস্থ্য ক্যাটাগরি</h2>
              <div className="space-y-1 flex flex-col">
                <button onClick={() => setFilters({...filters, category: 'all'})} className={`text-left px-space-xs py-1.5 rounded-lg font-label-md transition-colors ${filters.category === 'all' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}>
                  সকল ক্যাটাগরি
                </button>
                <button onClick={() => setFilters({...filters, category: 'gastric'})} className={`text-left flex items-center gap-1.5 px-space-xs py-1.5 rounded-lg font-label-md transition-colors ${filters.category === 'gastric' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[16px]">pill</span> গ্যাস্ট্রিক ও এসিডিটি
                </button>
                <button onClick={() => setFilters({...filters, category: 'diabetes'})} className={`text-left flex items-center gap-1.5 px-space-xs py-1.5 rounded-lg font-label-md transition-colors ${filters.category === 'diabetes' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[16px]">blood_pressure</span> ডায়াবেটিস
                </button>
                <button onClick={() => setFilters({...filters, category: 'cardiac'})} className={`text-left flex items-center gap-1.5 px-space-xs py-1.5 rounded-lg font-label-md transition-colors ${filters.category === 'cardiac' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[16px]">cardiology</span> কার্ডিওভাসকুলার
                </button>
                <button onClick={() => setFilters({...filters, category: 'fever'})} className={`text-left flex items-center gap-1.5 px-space-xs py-1.5 rounded-lg font-label-md transition-colors ${filters.category === 'fever' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[16px]">thermostat</span> জ্বর ও ব্যথা
                </button>
              </div>
            </div>

            {/* Manufacturer Filter */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-sm">
                <h2 className="font-headline-sm font-bold text-on-surface">উৎপাদক কোম্পানি</h2>
              </div>
              <div className="space-y-space-xs">
                {uniqueManufacturers.map(mfg => (
                  <label key={mfg || 'all'} className="flex items-center gap-space-xs text-body-sm text-on-surface cursor-pointer hover:text-primary">
                    <input type="radio" name="mfg_filter" value={mfg || ''} checked={filters.manufacturer === mfg} onChange={() => handleManufacturerChange(mfg)} className="w-4 h-4 text-primary accent-primary" />
                    <span>{mfg === null ? 'All Manufacturers' : mfg}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
              <h2 className="font-headline-sm font-bold text-on-surface mb-space-sm">মূল্য সীমা (Price)</h2>
              <div className="space-y-space-sm">
                <input 
                  type="range" min="5" max="2000" 
                  value={filters.maxPrice} 
                  onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                  className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div className="flex items-center justify-between gap-space-xs">
                  <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg w-full">
                    <span className="text-outline text-label-sm mr-1">৳</span>
                    <span className="text-body-sm">0</span>
                  </div>
                  <span className="text-outline">-</span>
                  <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg w-full">
                    <span className="text-outline text-label-sm mr-1">৳</span>
                    <span className="text-body-sm font-bold">{filters.maxPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply button for mobile */}
            <Button className="w-full lg:hidden mt-4" onClick={() => setIsMobileFilterOpen(false)}>Apply Filters</Button>

          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <div key={n} className="h-80 bg-surface-container-low rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                {filteredMedicines.map(medicine => (
                  <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-space-2xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4">
                  <span className="material-symbols-outlined text-[36px]">search_off</span>
                </div>
                <h3 className="font-headline-md font-bold text-on-surface mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
                <p className="font-body-md text-on-surface-variant max-w-md mb-6">
                  আপনার নির্বাচিত ফিল্টার বা সার্চ অনুযায়ী কোনো ওষুধ স্টকে নেই। অনুগ্রহ করে ভিন্ন নাম বা ফিল্টার ব্যবহার করে চেষ্টা করুন।
                </p>
                <Button variant="outline" onClick={clearFilters}>সব ফিল্টার মুছুন</Button>
              </div>
            )}
            
            {/* Embedded Banner - Only show if we have products */}
            {filteredMedicines.length > 0 && (
              <div className="mt-space-lg bg-gradient-to-r from-primary via-primary-container to-secondary rounded-2xl p-space-lg text-on-primary shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px] text-secondary-fixed">medical_information</span>
                  </div>
                  <div>
                    <span className="font-label-sm tracking-widest uppercase text-secondary-fixed">Pharmacist Substitution Guarantee</span>
                    <h4 className="font-headline-md font-bold mt-0.5">আপনার প্রেসক্রিপশনের ব্র্যান্ড খুঁজে পাচ্ছেন না?</h4>
                    <p className="font-body-sm mt-1 max-w-xl text-on-primary-container opacity-90">
                      প্রেসক্রিপশন আপলোড করলেই আমাদের রেগুলেটেড ফার্মাসিস্ট হুবহু একই জেনেরিক উপাদানের অনুমোদিত ও মানসম্মত বিকল্প সাজেস্ট করবেন।
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0 mt-4 md:mt-0">
                  <Button variant="outline" className="bg-surface-container-lowest border-0 text-primary hover:bg-surface-container-high" onClick={() => navigate('/login')}>
                    <span className="material-symbols-outlined text-[18px] mr-1">upload_file</span> প্রেসক্রিপশন দিন
                  </Button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
