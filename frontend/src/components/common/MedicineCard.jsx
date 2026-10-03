import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export const MedicineCard = ({ medicine, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between space-y-space-md group">
      <div className="cursor-pointer" onClick={() => navigate(`/product/${medicine.id}`)}>
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
