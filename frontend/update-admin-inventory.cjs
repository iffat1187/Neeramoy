const fs = require('fs');
let f = fs.readFileSync('src/pages/admin/AdminInventoryPage.jsx', 'utf8');

f = f.replace(
  "const [adjustData, setAdjustData] = useState({ type: 'add', qty: 0, reason: 'Manual correction' });",
  "const [adjustData, setAdjustData] = useState({ type: 'add', qty: 0, reason: 'Manual correction' });\n  const [successMsg, setSuccessMsg] = useState('');"
);

f = f.replace(
  "  const openModal = (med, type) => {\n    setModalState({ isOpen: true, med, type });\n    setAdjustData({ type: 'add', qty: type === 'restock' ? (med.reorderLevel * 2) : 0, reason: type === 'restock' ? 'New shipment' : 'Manual correction' });\n  };",
  "  const openModal = (med, type) => {\n    setModalState({ isOpen: true, med, type });\n    setAdjustData({ type: 'add', qty: type === 'restock' && med ? (med.reorderLevel * 2) : 0, reason: (type === 'restock' || type === 'addStock') ? 'New shipment' : 'Manual correction' });\n  };"
);

const oldHandleSave = `  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const med = modalState.med;
    let newStock = med.stock;
    const qty = parseInt(adjustData.qty, 10) || 0;

    if (modalState.type === 'restock') {
      newStock += qty;
    } else {
      if (adjustData.type === 'add') newStock += qty;
      else if (adjustData.type === 'remove') newStock = Math.max(0, newStock - qty);
      else if (adjustData.type === 'set') newStock = qty;
    }

    updateStock(med.id, newStock, adjustData.reason, modalState.type === 'restock' ? 'Restock' : 'Adjust');
    closeModal();
  };`;

const newHandleSave = `  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const med = modalState.med;
    if (!med) return;
    let newStock = med.stock;
    const qty = parseInt(adjustData.qty, 10) || 0;
    
    if (qty <= 0 && (modalState.type === 'addStock' || modalState.type === 'restock' || adjustData.type !== 'set')) {
      alert('Quantity must be greater than 0');
      return;
    }

    if (modalState.type === 'restock' || modalState.type === 'addStock') {
      newStock += qty;
    } else {
      if (adjustData.type === 'add') newStock += qty;
      else if (adjustData.type === 'remove') newStock = Math.max(0, newStock - qty);
      else if (adjustData.type === 'set') newStock = qty;
    }

    updateStock(med.id, newStock, adjustData.reason, modalState.type === 'restock' ? 'Restock' : (modalState.type === 'addStock' ? 'Add Stock' : 'Adjust'));
    setSuccessMsg(\`\${med.name} stock updated from \${med.stock} → \${newStock}.\`);
    setTimeout(() => setSuccessMsg(''), 5000);
    closeModal();
  };`;

f = f.replace(oldHandleSave, newHandleSave);

// Add button onClick
f = f.replace(
  '<button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold hover:bg-primary/90 transition-colors shrink-0">',
  '<button onClick={() => openModal(null, \\'addStock\\')} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold hover:bg-primary/90 transition-colors shrink-0">'
);

// Add Success Message to header
f = f.replace(
  "{/* Page Header */}",
  "{successMsg && <div className=\"bg-primary-container text-on-primary-container p-3 rounded-lg font-bold mb-2\">{successMsg}</div>}\n      {/* Page Header */}"
);

// Add Medicine selector and updated preview to modal
const oldModalTop = `<h2 className="font-headline-sm font-bold text-on-surface">{modalState.type === 'restock' ? 'Restock Medicine' : 'Adjust Stock'}</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md">
              <div className="flex items-center gap-3 mb-6 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                <div className="w-12 h-12 rounded-md bg-surface-container-highest/20 p-1">
                  <img src={modalState.med.image} alt={modalState.med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-label-md">{modalState.med.name}</span>
                  <span className="text-[11px] text-on-surface-variant">Current Stock: <strong className="text-on-surface">{modalState.med.stock}</strong> | Reorder: {modalState.med.reorderLevel}</span>
                </div>
              </div>`;

const newModalTop = `<h2 className="font-headline-sm font-bold text-on-surface">{modalState.type === 'addStock' ? 'Add Stock' : (modalState.type === 'restock' ? 'Restock Medicine' : 'Adjust Stock')}</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md">
              {modalState.type === 'addStock' && (
                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-label-sm font-bold text-on-surface">Select Medicine</label>
                  <select 
                    className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                    value={modalState.med ? modalState.med.id : ''}
                    onChange={(e) => {
                      const selected = inventory.find(m => m.id === e.target.value);
                      setModalState({...modalState, med: selected});
                    }}
                    required
                  >
                    <option value="" disabled>Select a medicine...</option>
                    {inventory.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (SKU: {m.sku})</option>
                    ))}
                  </select>
                </div>
              )}
              {modalState.med && (
              <div className="flex items-center gap-3 mb-6 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                <div className="w-12 h-12 rounded-md bg-surface-container-highest/20 p-1">
                  <img src={modalState.med.image} alt={modalState.med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-label-md">{modalState.med.name}</span>
                  <span className="text-[11px] text-on-surface-variant">Current Stock: <strong className="text-on-surface">{modalState.med.stock}</strong> | Reorder: {modalState.med.reorderLevel}</span>
                  <span className="text-[11px] text-primary font-bold mt-1">
                    Updated Stock Preview: {
                      modalState.type === 'restock' || modalState.type === 'addStock' ? modalState.med.stock + (parseInt(adjustData.qty)||0) : 
                      (adjustData.type === 'add' ? modalState.med.stock + (parseInt(adjustData.qty)||0) : 
                       adjustData.type === 'remove' ? Math.max(0, modalState.med.stock - (parseInt(adjustData.qty)||0)) : 
                       (parseInt(adjustData.qty)||0))
                    }
                  </span>
                </div>
              </div>
              )}`;

f = f.replace(oldModalTop, newModalTop);

// Fix the modal render condition
f = f.replace(
  "{modalState.isOpen && modalState.med && (",
  "{modalState.isOpen && (modalState.med || modalState.type === 'addStock') && ("
);

// Fix the input label
f = f.replace(
  "{modalState.type === 'restock' ? 'Quantity to Add' : 'Quantity'}",
  "{(modalState.type === 'restock' || modalState.type === 'addStock') ? 'Quantity to Add' : 'Quantity'}"
);

// Fix confirm button
f = f.replace(
  "Confirm {modalState.type === 'restock' ? 'Restock' : 'Adjustment'}</button>",
  "Confirm {modalState.type === 'addStock' ? 'Add Stock' : (modalState.type === 'restock' ? 'Restock' : 'Adjustment')}</button>"
);

fs.writeFileSync('src/pages/admin/AdminInventoryPage.jsx', f);
