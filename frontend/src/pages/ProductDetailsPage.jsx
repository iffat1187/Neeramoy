import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MedicineCard } from '../components/common/MedicineCard';
import { useCart } from '../context/CartContext';
import { medicineService } from '../services/medicineService';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    // Simulate API fetch
    medicineService.getTopSelling().then(data => {
      const found = data.find(m => m.id === id);
      if (found) {
        setProduct(found);
        // Get related products (mock: same category or first 4)
        const related = data.filter(m => m.category === found.category && m.id !== found.id).slice(0, 4);
        if (related.length < 4) {
          const fillers = data.filter(m => m.id !== found.id && !related.find(r => r.id === m.id)).slice(0, 4 - related.length);
          setRelatedProducts([...related, ...fillers]);
        } else {
          setRelatedProducts(related);
        }
      } else {
        setProduct(null); // Not found
      }
      setIsLoading(false);
      setQuantity(1);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl animate-pulse">
        <div className="h-6 w-1/3 bg-surface-container-low rounded mb-space-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          <div className="h-96 bg-surface-container-low rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-surface-container-low rounded"></div>
            <div className="h-6 w-1/2 bg-surface-container-low rounded"></div>
            <div className="h-20 w-full bg-surface-container-low rounded"></div>
            <div className="h-12 w-1/3 bg-surface-container-low rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-space-2xl min-h-[60vh]">
        <span className="material-symbols-outlined text-[64px] text-outline mb-4">medication</span>
        <h2 className="font-headline-lg font-bold text-on-surface">Product Not Found</h2>
        <p className="font-body-md text-on-surface-variant mt-2 mb-6">The requested medicine or product could not be found.</p>
        <Button onClick={() => navigate('/search')}>Browse Medicines</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 md:right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
          <span className="font-label-md">Added {quantity} item(s) to Cart!</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer flex items-center" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-[16px] mr-1">home</span> হোম
            </span>
            <span className="text-outline-variant">/</span>
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/category/${product.category}`)}>
              {product.category.toUpperCase()}
            </span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Hero */}
      <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-5 p-space-xl flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/20 bg-surface">
              <div className="w-full max-w-sm aspect-square bg-surface-container-low rounded-xl flex items-center justify-center p-space-lg mb-space-md overflow-hidden relative">
                {!product.inStock && (
                  <div className="absolute top-4 right-4 bg-error text-on-error px-2 py-1 rounded font-label-sm font-bold z-10 shadow-sm">
                    Out of Stock
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-2 py-1 rounded font-label-sm font-bold z-10 shadow-sm">
                    {product.discount}% OFF
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
              <div className="flex items-center gap-space-sm w-full max-w-sm">
                <div className="w-16 h-16 rounded-lg border-2 border-primary bg-surface-container-lowest p-1 cursor-pointer">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                </div>
                {/* Mock thumbnails */}
                <div className="w-16 h-16 rounded-lg border border-outline-variant/30 bg-surface-container-low p-1 cursor-pointer opacity-70 hover:opacity-100">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                </div>
              </div>
            </div>

            {/* Right: Details & Action */}
            <div className="lg:col-span-7 p-space-xl flex flex-col justify-between">
              <div className="space-y-space-md">
                <div className="flex items-center gap-space-xs">
                  {product.isOtc ? (
                    <Badge variant="secondary"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> OTC Medicine</Badge>
                  ) : (
                    <Badge variant="tertiary"><span className="material-symbols-outlined text-[14px]">prescriptions</span> Rx Required</Badge>
                  )}
                  <Badge variant="surface" className="border border-outline-variant/30">{product.form}</Badge>
                </div>
                
                <div>
                  <h1 className="font-headline-lg font-bold text-on-surface mb-1">{product.name}</h1>
                  <p className="font-body-lg text-on-surface-variant mb-2">Generic: <span className="font-medium text-on-surface">{product.genericName}</span></p>
                  <p className="font-label-md text-outline uppercase tracking-wider">{product.manufacturer}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                  <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-lg font-bold text-on-surface">{product.rating}</span>
                  <span className="text-outline text-body-sm">(124 Reviews)</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="font-headline-xl font-bold text-primary">৳ {product.price}</span>
                    {product.discount > 0 && (
                      <span className="font-headline-sm text-outline line-through mb-1">৳ {product.originalPrice}</span>
                    )}
                  </div>
                  <p className="font-body-sm text-on-surface-variant">Price per {product.unit} (Pack size: {product.packSize}s)</p>
                </div>
              </div>

              <div className="mt-space-xl bg-surface-container-low p-space-md rounded-xl space-y-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-on-surface-variant">Quantity:</span>
                  <div className="flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/50">
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center font-label-lg font-bold">
                      {quantity}
                    </span>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock || quantity >= 10}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 py-3 text-[16px] bg-surface-container-lowest" 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <span className="material-symbols-outlined mr-2">add_shopping_cart</span>
                    Add to Cart
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1 py-3 text-[16px] shadow-md" 
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                  >
                    Buy Now
                  </Button>
                </div>
                
                {!product.isOtc && (
                  <div className="flex items-start gap-2 pt-2 text-[12px] text-tertiary">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <p>A valid prescription is required to process the order for this medicine. You can upload it during checkout.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Details Section */}
      <div className="max-w-7xl mx-auto px-margin-desktop mb-space-xl">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-outline-variant/30 no-scrollbar">
            {[
              { id: 'description', label: 'Description' },
              { id: 'indications', label: 'Uses / Indications' },
              { id: 'dosage', label: 'How to Use' },
              { id: 'safety', label: 'Safety Information' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-space-lg py-4 font-label-md whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-space-xl min-h-[200px]">
            {activeTab === 'description' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">About {product.name}</h3>
                <p className="leading-relaxed">{product.description || `${product.name} is a reliable medication manufactured by ${product.manufacturer}. It contains ${product.genericName} and is primarily used for specific indications as directed by a physician.`}</p>
                <div className="bg-surface-container-low p-4 rounded-xl mt-6 inline-block">
                  <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Manufacturer</p>
                  <p className="font-label-md font-bold text-on-surface">{product.manufacturer}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'indications' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">Indications</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {(product.indications || ['As directed by the physician.']).map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'dosage' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-primary">Dosage & Administration</h3>
                <p className="leading-relaxed">{product.howToUse || 'Please follow the dosage instructions provided by your registered physician or as directed on the packaging.'}</p>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-4 font-body-md text-on-surface">
                <h3 className="font-headline-sm font-bold text-error">Safety & Precautions</h3>
                <div className="flex items-start gap-3 bg-error-container/30 p-4 rounded-xl text-on-surface">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  <p className="leading-relaxed">{product.safetyInfo || 'Consult your doctor before starting any new medication. Keep out of reach of children. Store in a cool, dry place.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-space-lg">
            <h2 className="font-headline-lg font-bold text-on-surface">Related Medicines</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
            {relatedProducts.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
