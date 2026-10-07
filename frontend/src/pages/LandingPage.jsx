import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MedicineCard } from '../components/common/MedicineCard';
import { medicineService } from '../services/medicineService';
import { useCart } from '../context/CartContext';

export const LandingPage = () => {
  const [topSelling, setTopSelling] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    medicineService.getTopSelling().then(data => setTopSelling(data));
  }, []);

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen pb-space-2xl">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low to-background pb-space-2xl pt-space-xl">
        <div className="max-w-7xl mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-space-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              DGDA অনুমোদিত ডিজিটাল ফার্মেসি
            </div>
            
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight font-bold">
              প্রেসক্রিপশন আপলোড করলেই ওষুধ পৌঁছে যাবে আপনার দরজায় — <span className="text-primary">২ ঘণ্টায় ডেলিভারি</span>
            </h1>
            
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Square, Beximco, ও Incepta থেকে সরাসরি সংগৃহীত ১০০% আসল ওষুধ। রেজিস্টার্ড 'এ' গ্রেড ফার্মাসিস্টের যাচাইকরণ এবং ২°C-৮°C কোল্ড-চেইন ডেলিভারি।
            </p>

                        <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.q.value; if(val) navigate('/search?q='+encodeURIComponent(val)); else navigate('/search'); }} className="flex flex-col sm:flex-row items-center gap-space-md w-full max-w-xl">
              <div className="flex-1 w-full bg-surface-container-lowest rounded-xl flex items-center px-space-md py-3 shadow-md focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <span className="material-symbols-outlined text-outline mr-3">search</span>
                <input 
                  type="text" 
                  name="q"
                  placeholder="ওষুধের নাম লিখুন (যেমন: Napa, Sergel 20...)" 
                  className="w-full border-0 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline" 
                />
              </div>
              <Button type="submit" variant="primary" className="w-full sm:w-auto h-full py-3.5 px-8">
                খুঁজুন
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-space-sm pt-2">
              <span className="font-label-sm text-outline uppercase tracking-wider">জনপ্রিয় অনুসন্ধান:</span>
              <span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Napa")}>Napa Extra</span>
              <span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Sergel")}>Sergel 20</span>
              <span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Monas")}>Monas 10</span>
              <span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/category/supplement")}>ভিটামিন (Vitamin)</span>
            </div>

            <div className="grid grid-cols-3 gap-space-md pt-space-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">local_shipping</span></div>
                <div className="flex flex-col"><span className="font-label-md font-bold text-on-surface">৫০,০০০+ অর্ডার</span><span className="text-[10px] text-outline">সফল ডেলিভারি</span></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">star</span></div>
                <div className="flex flex-col"><span className="font-label-md font-bold text-on-surface">৪.৯ রেটিং</span><span className="text-[10px] text-outline">রোগীর অভিজ্ঞতা</span></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center"><span className="material-symbols-outlined text-[20px]">support_agent</span></div>
                <div className="flex flex-col"><span className="font-label-md font-bold text-on-surface">১৫ মিনিট</span><span className="text-[10px] text-outline">ফার্মাসিস্ট কলব্যাক</span></div>
              </div>
            </div>
          </div>

          {/* Hero Right Floating Rx Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-lg border border-outline-variant/30 space-y-space-lg relative z-10">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold rounded-bl-xl rounded-tr-2xl">
                দ্রুত অর্ডার
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[28px]">document_scanner</span></div>
                <div>
                  <h2 className="font-headline-md font-bold text-on-surface">প্রেসক্রিপশন আপলোড (Rx)</h2>
                  <p className="font-body-sm text-outline">বাকি কাজ ফার্মাসিস্ট করে দেবেন</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-space-lg flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate('/login')}>
                <span className="material-symbols-outlined text-[32px] text-primary mb-2">upload_file</span>
                <span className="font-label-md font-bold text-on-surface">ছবি বা পিডিএফ ড্রপ করুন এখানে</span>
                <span className="font-body-sm text-outline mt-1">অথবা, ফাইল ব্রাউজ করুন</span>
              </div>

              <div className="space-y-space-md">
                <div className="space-y-1">
                  <label className="font-label-sm text-on-surface-variant font-bold">রোগীর নাম (ঐচ্ছিক)</label>
                  <input type="text" placeholder="রোগীর নাম লিখুন" className="w-full bg-surface-container-low border-0 outline-none rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-sm text-on-surface-variant font-bold">ডেলিভারি ঠিকানা</label>
                  <div className="w-full bg-surface-container-low rounded-lg px-4 py-3 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/login')}>
                    <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
                    <span className="text-body-md text-on-surface flex-1">ঠিকানা সিলেক্ট করুন...</span>
                    <span className="material-symbols-outlined text-[20px] text-outline">expand_more</span>
                  </div>
                </div>
                <Button variant="primary" className="w-full py-3.5 shadow-md text-[16px]" onClick={() => navigate('/login')}>
                  <span className="material-symbols-outlined">send</span> প্রেসক্রিপশন পাঠান ও অর্ডার কনফার্ম করুন
                </Button>
                <div className="flex items-start gap-2 pt-2 text-[11px] text-outline">
                  <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                  <p>আপনার আপলোড করা প্রেসক্রিপশন সম্পূর্ণ গোপনীয় ও সুরক্ষিত থাকবে। শুধুমাত্র আমাদের রেজিস্টার্ড ফার্মাসিস্ট এটি যাচাই করবেন।</p>
                </div>
              </div>
            </div>
            
            {/* Background decorative blob */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl z-0 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS / TRUST STEPS */}
      <section className="py-space-xl bg-surface border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="text-center mb-space-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm font-bold mb-2">মাত্র ৩ ধাপে অর্ডার</span>
            <h2 className="font-headline-md font-bold text-on-surface">এটি সহজ ধাপে ঘরে বসেই ওষুধ অর্ডার করুন</h2>
            <p className="font-body-md text-on-surface-variant mt-1">নিরাময় হেলথকেয়ার মডেল সম্পূর্ণ ঝামেলামুক্ত। নিশ্চিন্তে অর্ডার সম্পন্ন করুন。</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
            <Card className="flex flex-col text-center items-center py-space-xl z-10 border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-primary-container text-primary font-headline-md font-bold flex items-center justify-center mb-space-md border-4 border-surface-container-lowest">১</div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-2">প্রেসক্রিপশন আপলোড বা সার্চ</h3>
              <p className="font-body-sm text-on-surface-variant px-4">আপনার প্রেসক্রিপশনের ছবি তুলে ড্রপ করুন অথবা সার্চবার ব্যবহার করে প্রয়োজনীয় ওষুধ কার্টে যোগ করুন।</p>
            </Card>
            
            <Card className="flex flex-col text-center items-center py-space-xl z-10 border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary font-headline-md font-bold flex items-center justify-center mb-space-md border-4 border-surface-container-lowest">২</div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-2">ফার্মাসিস্ট ভেরিফিকেশন কল</h3>
              <p className="font-body-sm text-on-surface-variant px-4">আমাদের রেজিস্টার্ড 'এ' গ্রেড ফার্মাসিস্ট আপনার অর্ডারটি যাচাই করবেন এবং ডোজ বা বিকল্প নিয়ে পরামর্শ দেবেন।</p>
            </Card>
            
            <Card className="flex flex-col text-center items-center py-space-xl z-10 border border-outline-variant/20 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary font-headline-md font-bold flex items-center justify-center mb-space-md border-4 border-surface-container-lowest">৩</div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-2">সুপারফাস্ট ডেলিভারি ও পেমেন্ট</h3>
              <p className="font-body-sm text-on-surface-variant px-4">ঢাকায় ২ ঘণ্টায় এবং ঢাকার বাইরে ৪৮ ঘণ্টায় ডেলিভারি। ক্যাশ অন ডেলিভারি বা অনলাইনে পেমেন্ট করুন।</p>
            </Card>
            
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -translate-y-12 z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY DISCOVERY */}
      <section className="py-space-xl bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="flex items-center justify-between mb-space-lg">
            <div>
              <span className="font-label-sm uppercase tracking-wider text-outline font-bold">ব্রাউজ করুন</span>
              <h2 className="font-headline-lg font-bold text-on-surface">প্রয়োজনীয় ক্যাটাগরি ও স্বাস্থ্যসেবা</h2>
            </div>
            <Button variant="outline" className="hidden sm:flex" onClick={() => navigate('/search')}>সব ক্যাটাগরি <span className="material-symbols-outlined text-[18px]">arrow_forward</span></Button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-space-sm sm:gap-space-md">
            {[
              { title: 'প্রেসক্রিপশন ওষুধ', icon: 'prescriptions', color: 'bg-primary-container text-primary', path: '/category/medicine' },
              { title: 'ডায়াবেটিস ও ইনসুলিন', icon: 'vaccines', color: 'bg-secondary-fixed text-secondary', path: '/category/diabetes' },
              { title: 'হার্ট ও প্রেশার', icon: 'cardiology', color: 'bg-error-container text-error', path: '/category/cardiac' },
              { title: 'মা ও শিশু যত্ন', icon: 'child_care', color: 'bg-tertiary-fixed text-tertiary', path: '/category/baby-mom' },
              { title: 'সার্জিক্যাল ও হাইজিন', icon: 'sanitizer', color: 'bg-primary-fixed text-primary', path: '/category/home-care' },
              { title: 'গ্যাস্ট্রিক ও এসিডিটি', icon: 'pill', color: 'bg-surface-container-high text-on-surface-variant', path: '/category/gastric' },
              { title: 'মেডিকেল ডিভাইস', icon: 'monitor_heart', color: 'bg-surface-container-highest text-on-surface-variant', path: '/category/device' },
              { title: 'ভিটামিন ও নিউট্রিশন', icon: 'nutrition', color: 'bg-secondary-container text-secondary', path: '/category/supplement' },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate(cat.path)}>
                <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform shadow-sm`}>
                  <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                </div>
                <span className="font-label-md text-on-surface font-bold group-hover:text-primary transition-colors leading-tight">{cat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP SELLING MEDICINES */}
      <section className="py-space-2xl bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm uppercase tracking-wider text-primary font-bold">ভেরিফাইড মেডিসিন ও পণ্য</span>
              <h2 className="font-headline-lg font-bold text-on-surface">বেস্ট সেলিং ওষুধ ও নিত্যপ্রয়োজনীয় স্বাস্থ্যপণ্য</h2>
            </div>
            <Button variant="outline" className="bg-surface-container-lowest" onClick={() => navigate('/search')}>সবগুলো দেখুন <span className="material-symbols-outlined text-[18px]">arrow_forward</span></Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
            {topSelling.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. VALUE PROP BANNER (GREEN STRIP) */}
      <section className="py-space-2xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="bg-primary rounded-2xl p-space-xl shadow-xl overflow-hidden relative text-on-primary">
            {/* BG pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{backgroundSize: '20px 20px'}}></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto mb-space-xl">
              <span className="inline-block px-3 py-1 bg-on-primary text-primary font-label-sm font-bold rounded-full mb-3">ফার্মেসি কোয়ালিটি নিশ্চয়তা</span>
              <h2 className="font-headline-lg font-bold">কেন নিরাময় বেছে নেবেন?</h2>
              <p className="font-body-md opacity-90 mt-2">স্বাস্থ্যসেবা সম্পর্কিত যেকোনো প্রয়োজনে আমরা সবসময় আপনার পাশেই আছি। আমাদের রয়েছে ৪টি বিশেষ সুবিধা।</p>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {[
                { i: 'verified_user', t: '১০০% আসল ও নকল মুক্ত', d: 'সরাসরি প্রস্তুতকারক ব্র্যান্ড যেমন স্কয়ার, বেক্সিমকো থেকে সোর্স করা। প্রতিটি প্যাক ফার্মাসিস্ট দ্বারা ভেরিফাইড।' },
                { i: 'ac_unit', t: '২°C - ৮°C কোল্ড-চেইন গ্যারান্টি', d: 'ইনসুলিন, ভ্যাকসিন ও স্পর্শকাতর মেডিসিনগুলোর মান ঠিক রাখতে সম্পূর্ণ আইসোলেটেড কোল্ড-বক্স ডেলিভারি।' },
                { i: 'medical_services', t: 'ফ্রি ফার্মাসিস্ট পরামর্শ', d: "প্রেসক্রিপশনের যেকোনো জটিলতা, সাইড ইফেক্ট ও সঠিক ডোজ সম্পর্কে রেজিস্টার্ড 'এ' গ্রেড ফার্মাসিস্টের পরামর্শ নিন।" },
                { i: 'currency_exchange', t: 'নিশ্চিন্ত পেমেন্ট ও রিটার্ন', d: 'ওষুধ হাতে পেয়ে ক্যাশ অন ডেলিভারি। ভুল বা ক্ষতিগ্রস্থ ওষুধের ক্ষেত্রে দ্রুততম রিপ্লেসমেন্ট বা রিটার্নের ১০০% নিশ্চয়তা।' }
              ].map((val, idx) => (
                <div key={idx} className="bg-primary-container/40 p-space-md rounded-xl backdrop-blur-sm border border-primary-container">
                  <div className="w-12 h-12 rounded-lg bg-on-primary text-primary flex items-center justify-center mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">{val.i}</span>
                  </div>
                  <h3 className="font-headline-sm font-bold mb-2">{val.t}</h3>
                  <p className="font-body-sm opacity-80 leading-relaxed">{val.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CHRONIC CARE / SUBSCRIPTION */}
      <section className="py-space-xl bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <div className="bg-surface-container-low rounded-2xl p-space-xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-lg">
            <div className="flex-1 space-y-space-sm text-center md:text-left">
              <div className="inline-flex items-center gap-1 text-primary font-bold font-label-sm">
                <span className="material-symbols-outlined text-[18px]">event_repeat</span> মাসিক সাবস্ক্রিপশন প্ল্যান
              </div>
              <h2 className="font-headline-lg font-bold text-on-surface tracking-tight">বাবা-মায়ের ডায়াবেটিস ও প্রেশারের ওষুধ প্রতি মাসে ফুরিয়ে যাওয়ার চিন্তা আর নয়!</h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl">একবার সাবস্ক্রাইব করে দিন। নির্দিষ্ট তারিখে জিরো ডেলিভারি চার্জে ওষুধ পৌঁছে যাবে আপনার ঠিকানায়। সাথে পাবেন অতিরিক্ত ৫% ছাড়।</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <span className="flex items-center gap-1 font-label-md text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> সম্পূর্ণ বিনামূল্যে বাতিল</span>
                <span className="flex items-center gap-1 font-label-md text-on-surface"><span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> যেকোনো সময় পরিবর্তনযোগ্য</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              <div className="bg-surface-container-highest p-4 rounded-xl text-center">
                <p className="font-label-sm text-on-surface-variant mb-1">অতিরিক্ত ডিসকাউন্ট উপভোগ করুন</p>
                <div className="font-headline-md text-primary font-bold">সর্বোচ্চ ৫% ছাড়</div>
              </div>
              <Button variant="primary" className="w-full py-3 shadow-md" onClick={() => navigate('/login')}>সাবস্ক্রিপশন চালু করুন</Button>
              <button className="text-outline font-label-sm hover:text-primary transition-colors mt-1" onClick={() => navigate('/login')}>কিভাবে কাজ করে জানুন</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PARTNER BRANDS STRIP */}
      <section className="py-space-lg bg-surface border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-desktop text-center">
          <p className="font-label-sm text-outline uppercase tracking-widest mb-6">সরাসরি প্রস্তুতকারক পার্টনার</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12 lg:gap-x-16 opacity-60 grayscale">
            <span className="font-headline-sm font-bold text-on-surface">SQUARE</span>
            <span className="font-headline-sm font-bold text-on-surface">BEXIMCO PHARMA</span>
            <span className="font-headline-sm font-bold text-on-surface">INCEPTA</span>
            <span className="font-headline-sm font-bold text-on-surface">RENATA</span>
            <span className="font-headline-sm font-bold text-on-surface">HEALTHCARE</span>
            <span className="font-headline-sm font-bold text-on-surface">ACME</span>
          </div>
        </div>
      </section>

      {/* 8. REVIEWS */}
      <section className="py-space-2xl bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-margin-desktop space-y-space-xl">
          <div className="text-center space-y-1">
            <span className="font-label-sm uppercase tracking-wider text-primary font-bold">রোগীর অভিজ্ঞতা</span>
            <h2 className="font-headline-lg text-on-surface font-bold">ঢাকার দ্রুততম ডেলিভারি নিয়ে গ্রাহকদের মতামত</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {[
              { t: '"বাবার ইনসুলিন নিয়ে খুব চিন্তিত থাকতাম। নিরাময়ের কোল্ড-চেইন ডেলিভারি সত্যি অসাধারণ। আইসপ্যাক সহ ঠিক দেড় ঘণ্টায় ধানমন্ডিতে ওষুধ হাতে পেয়েছি। ১০০% জেনুইন।"', n: 'মাহমুদুল হাসান', l: 'ধানমন্ডি, ঢাকা • ভেরিফাইড ক্রেতা' },
              { t: '"আমার মায়ের প্রেসক্রিপশন আপলোড করার ১০ মিনিটের মধ্যেই ফার্মাসিস্ট আমাকে কল করে ওষুধের সঠিক ডোজ বুঝিয়ে দিয়েছেন। এত চমৎকার সেবা আগে কখনো পাইনি!"', n: 'শায়লা আক্তার', l: 'মিরপুর ১৩, ঢাকা • ভেরিফাইড ক্রেতা' },
              { t: '"খুব সহজে ওষুধ অর্ডার করা যায়। নিরাময়ের অ্যাপটি অনেক ইউজার ফ্রেন্ডলি। বিশেষ করে প্রতি মাসের অটো-রিফিল সাবস্ক্রিপশন আমার জীবনটাকে অনেক সহজ করে দিয়েছে।"', n: 'জাহিদ হোসেন', l: 'উত্তরা সেক্টর ৩, ঢাকা • ভেরিফাইড ক্রেতা' }
            ].map((rev, i) => (
              <Card key={i} className="p-space-lg space-y-space-md flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-tertiary">
                    {[...Array(5)].map((_, j) => <span key={j} className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed italic">{rev.t}</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-headline-sm">{rev.n.charAt(0)}</div>
                  <div>
                    <div className="font-label-md font-bold text-on-surface">{rev.n}</div>
                    <div className="text-[11px] text-outline">{rev.l}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
