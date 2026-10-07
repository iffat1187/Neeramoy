const fs = require('fs');
const path = require('path');

const landingPath = path.join(__dirname, 'src', 'pages', 'LandingPage.jsx');
let content = fs.readFileSync(landingPath, 'utf8');

// Replace category array
const oldArray = `[
              { title: 'প্রেসক্রিপশন ওষুধ', icon: 'prescriptions', color: 'bg-primary-container text-primary' },
              { title: 'ডায়াবেটিস ও ইনসুলিন', icon: 'vaccines', color: 'bg-secondary-fixed text-secondary' },
              { title: 'হার্ট ও প্রেশার', icon: 'cardiology', color: 'bg-error-container text-error' },
              { title: 'মা ও শিশু যত্ন', icon: 'child_care', color: 'bg-tertiary-fixed text-tertiary' },
              { title: 'সার্জিক্যাল ও হাইজিন', icon: 'sanitizer', color: 'bg-primary-fixed text-primary' },
              { title: 'গ্যাস্ট্রিক ও এসিডিটি', icon: 'pill', color: 'bg-surface-container-high text-on-surface-variant' },
              { title: 'মেডিকেল ডিভাইস', icon: 'monitor_heart', color: 'bg-surface-container-highest text-on-surface-variant' },
              { title: 'ভিটামিন ও নিউট্রিশন', icon: 'nutrition', color: 'bg-secondary-container text-secondary' },
            ]`;

const newArray = `[
              { title: 'প্রেসক্রিপশন ওষুধ', icon: 'prescriptions', color: 'bg-primary-container text-primary', path: '/category/medicine' },
              { title: 'ডায়াবেটিস ও ইনসুলিন', icon: 'vaccines', color: 'bg-secondary-fixed text-secondary', path: '/category/diabetes' },
              { title: 'হার্ট ও প্রেশার', icon: 'cardiology', color: 'bg-error-container text-error', path: '/category/cardiac' },
              { title: 'মা ও শিশু যত্ন', icon: 'child_care', color: 'bg-tertiary-fixed text-tertiary', path: '/category/baby-mom' },
              { title: 'সার্জিক্যাল ও হাইজিন', icon: 'sanitizer', color: 'bg-primary-fixed text-primary', path: '/category/home-care' },
              { title: 'গ্যাস্ট্রিক ও এসিডিটি', icon: 'pill', color: 'bg-surface-container-high text-on-surface-variant', path: '/category/gastric' },
              { title: 'মেডিকেল ডিভাইস', icon: 'monitor_heart', color: 'bg-surface-container-highest text-on-surface-variant', path: '/category/device' },
              { title: 'ভিটামিন ও নিউট্রিশন', icon: 'nutrition', color: 'bg-secondary-container text-secondary', path: '/category/supplement' },
            ]`;

content = content.replace(oldArray, newArray);

const oldMap = `map((cat, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate('/search')}>`;

const newMap = `map((cat, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => navigate(cat.path)}>`;

content = content.replace(oldMap, newMap);

// Replace hardcoded /search on popular tags
content = content.replace(
  /<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors">Napa Extra<\/span>/,
  '<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Napa")}>Napa Extra</span>'
);
content = content.replace(
  /<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors">Sergel 20<\/span>/,
  '<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Sergel")}>Sergel 20</span>'
);
content = content.replace(
  /<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors">Monas 10<\/span>/,
  '<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/search?q=Monas")}>Monas 10</span>'
);
content = content.replace(
  /<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors">ভিটামিন \(Vitamin\)<\/span>/,
  '<span className="bg-surface-container px-3 py-1 rounded-full text-on-surface font-label-sm cursor-pointer hover:bg-surface-container-high transition-colors" onClick={() => navigate("/category/supplement")}>ভিটামিন (Vitamin)</span>'
);

// Search input handling
const searchInputOld = `<div className="flex flex-col sm:flex-row items-center gap-space-md w-full max-w-xl">
              <div className="flex-1 w-full bg-surface-container-lowest rounded-xl flex items-center px-space-md py-3 shadow-md focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <span className="material-symbols-outlined text-outline mr-3">search</span>
                <input 
                  type="text" 
                  placeholder="ওষুধের নাম লিখুন (যেমন: Napa, Sergel 20...)" 
                  className="w-full border-0 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline" 
                />
              </div>
              <Button variant="primary" className="w-full sm:w-auto h-full py-3.5 px-8" onClick={() => navigate('/search')}>
                খুঁজুন
              </Button>
            </div>`;

const searchInputNew = `            <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.q.value; if(val) navigate('/search?q='+encodeURIComponent(val)); else navigate('/search'); }} className="flex flex-col sm:flex-row items-center gap-space-md w-full max-w-xl">
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
            </form>`;

content = content.replace(searchInputOld, searchInputNew);

fs.writeFileSync(landingPath, content);
console.log('LandingPage updated successfully.');
