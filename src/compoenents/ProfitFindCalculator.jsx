import React, { useState, useRef, useEffect } from 'react';

const REAL_DARAZ_CATEGORIES = [
  { id: 1, name: "Powerpoints, Switches & Savers", rate: 12.90 },
  { id: 2, name: "Power Supply Units (PSU / Converters)", rate: 8.60 },
  { id: 3, name: "Mobiles & Tablets", rate: 2.50 },
  { id: 4, name: "Computers & Laptops", rate: 4.50 },
  { id: 5, name: "TV, Audio / Video, Gaming & Wearables", rate: 6.50 },
  { id: 6, name: "Home Appliances (Large / AC / Fridge)", rate: 3.40 },
  { id: 7, name: "Tools, DIY & Outdoor", rate: 12.90 },
  { id: 8, name: "Health & Beauty", rate: 10.00 },
  { id: 9, name: "Fashion (Clothing & Apparel)", rate: 12.90 },
  { id: 10, name: "Watches Sunglasses Jewellery", rate: 17.20 },
  { id: 11, name: "Groceries", rate: 3.40 },
  { id: 12, name: "Furniture & Decor", rate: 11.50 },
  { id: 13, name: "Kitchen & Dining", rate: 12.90 },
  { id: 14, name: "Stationery & Craft", rate: 10.50 }
];

const PROVINCES = [
  { id: 'punjab', name: 'Punjab (16%)', vat: 16 },
  { id: 'sindh', name: 'Sindh (15%)', vat: 15 },
  { id: 'balochistan', name: 'Balochistan (15%)', vat: 15 },
  { id: 'kpk', name: 'KPK (15%)', vat: 15 }
];

function ProfitCalculator({ onResultChange }) {
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taxStatus, setTaxStatus] = useState('filer'); 
  const [province, setProvince] = useState('sindh'); 
  const [results, setResults] = useState(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);

  const catRef = useRef(null);
  const provRef = useRef(null);

  const currentCategory = REAL_DARAZ_CATEGORIES.find(c => c.id === parseInt(selectedCategory));
  const commissionRate = currentCategory ? currentCategory.rate : 0;
  const selectedProvinceObj = PROVINCES.find(p => p.id === province);
  
  const PAYMENT_FEE_RATE = 2.25; 
  const fbrRate = taxStatus === 'filer' ? 1.0 : 2.0;
  const provincialVatRate = selectedProvinceObj ? selectedProvinceObj.vat : 15;

  useEffect(() => {
    function handleClickOutside(event) {
      if (catRef.current && !catRef.current.contains(event.target)) setIsCategoryOpen(false);
      if (provRef.current && !provRef.current.contains(event.target)) setIsProvinceOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (setter, val) => {
    setter(val);
    setResults(null);
    onResultChange(false); // Reset outer scroll whenever user alters input field values
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const productPrice = parseFloat(price);
    if (!productPrice || productPrice <= 0 || !selectedCategory) {
      alert("Please specify a valid item market listing price.");
      return;
    }

    const darazCommission = (productPrice * commissionRate) / 100;
    const paymentFee = (productPrice * PAYMENT_FEE_RATE) / 100;
    const darazServiceTax = ((darazCommission + paymentFee) * provincialVatRate) / 100;
    const fbrTax = (productPrice * fbrRate) / 100; 
    
    const totalDeductions = darazCommission + paymentFee + darazServiceTax + fbrTax;
    const finalPayout = productPrice - totalDeductions;

    setResults({
      darazCommission: darazCommission.toFixed(2),
      paymentFee: paymentFee.toFixed(2),
      darazServiceTax: darazServiceTax.toFixed(2),
      fbrTax: fbrTax.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      finalPayout: finalPayout.toFixed(2),
    });

    onResultChange(true); // Tell parent to activate standard viewport scrolling
  };

  return (
    <div className={`grid grid-cols-1 gap-4 items-start h-auto transition-all duration-500 ${results ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
      <div className="flex flex-col space-y-3.5 h-auto">
        <form onSubmit={handleCalculate} className="space-y-3.5 h-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 font-mono">
                Price
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  inputMode="numeric"
                  placeholder="Real Price..." 
                  value={price}
                  onChange={(e) => handleInputChange(setPrice, e.target.value)}
                  className="w-full bg-[#040612] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition font-mono text-xs sm:text-sm font-medium h-[40px]"
                  required
                />
                <span className="absolute right-3 top-2.5 text-2xs font-mono text-slate-600">PKR</span>
              </div>
            </div>

            <div className="relative" ref={provRef}>
              <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 font-mono">
                Province
              </label>
              <div 
                onClick={() => setIsProvinceOpen(!isProvinceOpen)}
                className="w-full bg-[#040612] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs sm:text-sm font-medium flex justify-between items-center cursor-pointer transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 h-[40px]"
              >
                <span className="truncate">{selectedProvinceObj ? selectedProvinceObj.name : 'Select Region'}</span>
                <div className="flex items-center pl-2 border-l border-slate-800 h-full ml-1">
                  <svg className={`w-3 h-3 text-slate-400 transition-transform ${isProvinceOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {isProvinceOpen && (
                <div className="absolute z-[120] mt-1 w-full bg-[#0b0e22] border border-slate-800 rounded-lg shadow-2xl max-h-40 overflow-y-auto custom-scroll left-0 right-0">
                  {PROVINCES.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { handleInputChange(setProvince, p.id); setIsProvinceOpen(false); }}
                      className={`px-3 py-2 text-xs sm:text-sm cursor-pointer transition border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/60 ${province === p.id ? 'text-cyan-400 font-bold bg-slate-900/40' : 'text-slate-300'}`}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative" ref={catRef}>
            <label className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 font-mono">
              Product Category
            </label>
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-[#040612] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs sm:text-sm font-medium flex justify-between items-center cursor-pointer transition focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 h-[40px]"
            >
              <span className="truncate">{currentCategory ? `${currentCategory.name} (${currentCategory.rate}%)` : 'Select category node...'}</span>
              <div className="flex items-center pl-2 border-l border-slate-800 h-full ml-1">
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            {isCategoryOpen && (
              <div className="absolute z-[120] mt-1 w-full bg-[#0b0e22] border border-slate-800 rounded-lg shadow-2xl max-h-36 overflow-y-auto custom-scroll left-0 right-0">
                {REAL_DARAZ_CATEGORIES.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => { handleInputChange(setSelectedCategory, category.id); setIsCategoryOpen(false); }}
                    className={`px-3 py-2 text-xs sm:text-sm cursor-pointer transition border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/60 ${selectedCategory === category.id ? 'text-fuchsia-400 font-bold bg-slate-900/40' : 'text-slate-300'}`}
                  >
                    {category.name} ({category.rate}%)
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#040612] border border-slate-800/60 rounded-lg p-2 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono pl-1">FBR Status:</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleInputChange(setTaxStatus, 'filer')}
                className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md text-3xs sm:text-xs font-mono font-bold uppercase transition ${taxStatus === 'filer' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.25)]' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
              >
                Filer (1%)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange(setTaxStatus, 'non-filer')}
                className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md text-3xs sm:text-xs font-mono font-bold uppercase transition ${taxStatus === 'non-filer' ? 'bg-fuchsia-500 text-slate-950 shadow-[0_0_8px_rgba(217,70,239,0.25)]' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
              >
                Non-Filer (2%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#040612] border-b border-fuchsia-500 rounded-lg p-1 text-center">
              <span className="block text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase font-mono">Commission</span>
              <span className="text-2xs sm:text-xs font-black text-fuchsia-400 block font-mono">{commissionRate}%</span>
            </div>
            <div className="bg-[#040612] border-b border-cyan-500 rounded-lg p-1 text-center">
              <span className="block text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase font-mono">Payment</span>
              <span className="text-2xs sm:text-xs font-black text-cyan-400 block font-mono">{PAYMENT_FEE_RATE}%</span>
            </div>
            <div className="bg-[#040612] border-b border-amber-500 rounded-lg p-1 text-center">
              <span className="block text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase font-mono">FBR Tax</span>
              <span className="text-2xs sm:text-xs font-black text-amber-400 block font-mono">{fbrRate}%</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full rounded-lg py-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:opacity-90 transition active:scale-[0.99] h-[38px]"
          >
            Calculate Profit
          </button>
        </form>
      </div>

      {results && (
        <div className="space-y-3 flex flex-col justify-start h-auto border-t border-slate-800/60 md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 overflow-visible">
          <div>
            <h3 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase font-mono mb-1.5">Deduction Statement</h3>
            <div className="space-y-2 text-xs font-mono text-slate-300 bg-[#040612]/50 border border-slate-800/40 rounded-lg p-2.5">
              <div className="flex justify-between items-center gap-2">
                <span className="truncate">Daraz Comm. ({commissionRate}%):</span>
                <span className="text-fuchsia-400 font-bold shrink-0 text-right">- Rs {results.darazCommission}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="truncate">Payment Gateway:</span>
                <span className="text-cyan-400 font-bold shrink-0 text-right">- Rs {results.paymentFee}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="truncate">Service GST ({provincialVatRate}%):</span>
                <span className="text-purple-400 font-bold shrink-0 text-right">- Rs {results.darazServiceTax}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="truncate">FBR Income Tax:</span>
                <span className="text-amber-400 font-bold shrink-0 text-right">- Rs {results.fbrTax}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-dashed border-slate-800 text-[10px] font-bold text-slate-500">
                <span>Total Deductions:</span>
                <span className="text-slate-400">Rs {results.totalDeductions}</span>
              </div>
            </div>
          </div>

          <div className="relative mt-0.5 h-auto">
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-lg blur-sm opacity-30"></div>
            <div className="relative bg-[#040612] border border-cyan-500/20 rounded-lg p-2.5 flex justify-between items-center gap-4 h-auto">
              <div className="min-w-0">
                <span className="block text-[8px] font-bold tracking-wider text-slate-500 uppercase font-mono">Net Profit Payout</span>
                <span className="text-base sm:text-lg md:text-xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text block font-mono tracking-tight truncate">
                  Rs {results.finalPayout}
                </span>
              </div>
              <div className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-800 text-[8px] font-mono text-emerald-400 rounded font-bold uppercase tracking-wider shrink-0">
                Verified
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfitCalculator;