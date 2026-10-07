const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src', 'components', 'Navbar.jsx');
let content = fs.readFileSync(navbarPath, 'utf8');

const oldCategoriesRegex = /const categories = \[\s*\{[\s\S]*?\];/m;

const newCategories = `const categories = [
  { name: "Home", path: "/" },
  { name: "Medicine", path: "/category/medicine" },
  { name: "Prescription", path: "/prescriptions", icon: "upload_file" },
  { name: "Healthcare", path: "/category/healthcare" },
  { name: "Beauty", path: "/category/beauty" },
  { name: "Baby & Mom Care", path: "/category/baby-mom-care" },
  { name: "Herbal", path: "/category/herbal" },
  { name: "Home Care", path: "/category/home-care" },
  { name: "Supplement", path: "/category/supplement" },
  { name: "Food and Nutrition", path: "/category/food-and-nutrition" },
  { name: "Pet Care", path: "/category/pet-care" },
  { name: "Veterinary", path: "/category/veterinary" },
  { name: "Homeopathy", path: "/category/homeopathy" },
  { name: "Browse by Health Concern", path: "/category/browse-by-health-concern" }
];`;

content = content.replace(oldCategoriesRegex, newCategories);
fs.writeFileSync(navbarPath, content);
console.log('Categories updated in Navbar.jsx');
