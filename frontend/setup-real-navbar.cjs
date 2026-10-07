const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src', 'components', 'layout', 'Navbar.jsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// Ensure NavLink is imported
content = content.replace(/import { Link, useNavigate } from 'react-router-dom';/, "import { Link, NavLink, useNavigate } from 'react-router-dom';");

const oldNav = `<nav className="flex items-center overflow-x-auto py-2 gap-space-md text-label-md font-label-md no-scrollbar">
            <Link to="/search" className="whitespace-nowrap transition-colors bg-primary-container text-on-primary-container font-bold px-3 py-1.5 rounded-lg">প্রেসক্রিপশন ওষুধ</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">সাধারণ ওষুধ (OTC)</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">ডায়াবেটিস ও ইনসুলিন</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">মা ও শিশু স্বাস্থ্য</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">মেডিকেল ডিভাইস</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">সার্জিক্যাল ও হাইজিন</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">বিশেষ অফার</Link>
          </nav>`;

const newNav = `<nav className="flex items-center overflow-x-auto py-2 gap-space-md text-label-md font-label-md no-scrollbar">
            <NavLink to="/category/prescription-medicine" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>প্রেসক্রিপশন ওষুধ</NavLink>
            <NavLink to="/category/otc-medicine" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>সাধারণ ওষুধ (OTC)</NavLink>
            <NavLink to="/category/diabetes-insulin" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>ডায়াবেটিস ও ইনসুলিন</NavLink>
            <NavLink to="/category/baby-mom" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>মা ও শিশু স্বাস্থ্য</NavLink>
            <NavLink to="/category/medical-device" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>মেডিকেল ডিভাইস</NavLink>
            <NavLink to="/category/surgical-hygiene" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>সার্জিক্যাল ও হাইজিন</NavLink>
            <NavLink to="/category/special-offers" className={({ isActive }) => \`whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>বিশেষ অফার</NavLink>
          </nav>`;

content = content.replace(oldNav, newNav);

fs.writeFileSync(navbarPath, content);
console.log('Real Navbar layout updated successfully.');
