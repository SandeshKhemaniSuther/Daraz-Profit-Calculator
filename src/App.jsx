import React, { useState } from 'react';
import darazLogo from './assets/daraz-logo.png'; 
import PriceCalculator from './compoenents/PriceFindCalculator';
import ProfitCalculator from './compoenents/ProfitFindCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('profit-find');
  const [hasResults, setHasResults] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setHasResults(false); 
  };

  return (
    // FIX: H-auto and Min-H-Screen behavior mapped carefully. 
    // Results aate hi height switch ho jayegi taaki vertical scroll blocks na hon.
    <div className={`w-full bg-[#050711] text-slate-100 flex flex-col items-center justify-start lg:justify-center p-3 sm:p-6 md:p-8 overflow-x-hidden relative font-sans transition-all duration-300 ${
      hasResults ? 'min-h-screen h-auto overflow-y-auto lg:h-screen lg:overflow-hidden' : 'h-screen overflow-hidden'
    }`}>
      
      {/* Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-cyan-500/5 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-fuchsia-500/5 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none z-0"></div>

      {/* Main Structural Wrapper Panel */}
      <div className="w-full transition-all duration-500 ease-out relative z-10 my-4 lg:my-auto max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl flex flex-col shrink-0">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-amber-400 rounded-xl blur-[1px] opacity-60"></div>
        
        {/* Main Application Base Card */}
        <div className="relative w-full h-auto bg-[#0b0e22]/95 border border-slate-800/60 backdrop-blur-2xl rounded-xl p-4 sm:p-6 shadow-2xl flex flex-col">
          
          {/* Header Node */}
          <div className="flex flex-col items-center justify-center mb-4 space-y-1.5 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 shadow-inner">
              <img 
                src={darazLogo} 
                alt="Daraz Logo" 
                className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_0_6px_rgba(244,91,10,0.3)]"
              />
            </div>
            <div className="text-center">
              <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent uppercase">
                Electrica Calc Suite
              </h1>
              <p className="text-[8px] text-fuchsia-400/80 font-mono uppercase tracking-[0.2em]">Daraz Engine Toolkit</p>
            </div>
          </div>

          {/* Tab Selection Navigation */}
          <div className="flex border border-slate-800 bg-[#040612]/80 rounded-xl p-1 mb-4 gap-1.5 shrink-0">
            <button
              onClick={() => handleTabChange('price-find')}
              className={`flex-1 py-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase rounded-lg transition-all duration-300 ${
                activeTab === 'price-find'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              🔍 Price Find
            </button>
            <button
              onClick={() => handleTabChange('profit-find')}
              className={`flex-1 py-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase rounded-lg transition-all duration-300 ${
                activeTab === 'profit-find'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-slate-950 shadow-[0_0_10px_rgba(217,70,239,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              📈 Profit Find
            </button>
          </div>

          {/* Core Calculator Injection Area */}
          <div className="w-full overflow-visible">
            {activeTab === 'price-find' ? (
              <PriceCalculator onResultChange={setHasResults} />
            ) : (
              <ProfitCalculator onResultChange={setHasResults} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;