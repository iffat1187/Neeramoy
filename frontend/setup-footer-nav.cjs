const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, 'src', 'components', 'Footer.jsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');

footerContent = footerContent.replace(/<a className="hover:text-primary transition-colors" href="#">/g, '<Link className="hover:text-primary transition-colors" to="/">');
footerContent = footerContent.replace(/<\/a>/g, '</Link>');
footerContent = footerContent.replace(/import React from 'react';/, "import React from 'react';\nimport { Link } from 'react-router-dom';");

fs.writeFileSync(footerPath, footerContent);

const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('<Route path="health-concerns" element={<SearchResultsPage />} />')) {
  appContent = appContent.replace(
    /<Route path="search" element={<SearchResultsPage \/>} \/>/g, 
    '<Route path="search" element={<SearchResultsPage />} />\n              <Route path="health-concerns" element={<SearchResultsPage />} />'
  );
  fs.writeFileSync(appPath, appContent);
}

console.log('Footer and App updated successfully.');
