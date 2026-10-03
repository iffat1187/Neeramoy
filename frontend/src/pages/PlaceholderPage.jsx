import React from 'react';

export const PlaceholderPage = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl">
      <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-space-md">{title}</h1>
      <p className="font-body-lg text-on-surface-variant">This page is currently under construction. Please check back later.</p>
    </div>
  );
};
