const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src', 'components', 'Navbar.jsx');
let f = fs.readFileSync(navbarPath, 'utf8');

f = f.replace(/import { Link, useNavigate } from 'react-router-dom';/, "import { Link, NavLink, useNavigate } from 'react-router-dom';");

const oldMap = `<Link key={index} to={category.path} className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-colors">
                {category.icon && <span className="material-symbols-outlined text-[18px]">{category.icon}</span>}
                <span>{category.name}</span>
              </Link>`;

const newMap = `<NavLink key={index} to={category.path} className={({ isActive }) => \`flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg whitespace-nowrap transition-colors \${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}>
                {category.icon && <span className="material-symbols-outlined text-[18px]">{category.icon}</span>}
                <span>{category.name}</span>
              </NavLink>`;

f = f.replace(oldMap, newMap);
fs.writeFileSync(navbarPath, f);
console.log('Navbar.jsx updated with NavLink successfully.');
