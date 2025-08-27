import './App.css'
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import CurrencySelector from './components/CurrencySelector';
import AmountInput from './components/AmountInput';
import ConversionResult from './components/ConversionResult';

function App() {
  const {
    amount,
    fromCurrency,
    toCurrency,
    loading,
    error,
    lastUpdated,
    darkMode,
    exchangeRates,
    setAmount,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
    fetchExchangeRates,
    getCurrentRate,
    toggleDarkMode,
  } = useStore();

  // Calculate converted amount
  const getConvertedAmount = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue === 0) return '0.00';
    
    if (!exchangeRates || !exchangeRates[toCurrency] || fromCurrency === toCurrency) {
      return amountValue.toFixed(2);
    }
    
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const result = amountValue * rate;
    
    // Format the result to show appropriate decimal places
    if (result >= 1000) {
      return result.toFixed(2);
    } else if (result >= 1) {
      return result.toFixed(4);
    } else {
      return result.toFixed(6);
    }
  };

  // Fetch exchange rates when component mounts or when fromCurrency changes
  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency, fetchExchangeRates]);

  // Toggle dark mode on the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const convertedAmount = getConvertedAmount();
  const currentRate = getCurrentRate();

  return (
    <div className="relative min-h-screen transition-colors duration-200">
      {/* Blurred Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/currency-image.jpg)',
          filter: 'blur(6px) brightness(0.9)',
          transform: 'scale(1.05)',
          zIndex: -1,
        }}
      >
        <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-12 relative z-10">
        {/* Header */}
        <header className="mb-8 md:mb-12 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <img 
                src="/logo.png" 
                alt="Currency Converter Logo" 
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-white">
                  Currency-Converter
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Convert between different currencies with live exchange rates
                </p>
              </div>
            </div>
            <div className="absolute right-0 top-0 group">
              <div className="absolute -right-2 -top-2 w-8 h-8 bg-green-200 dark:bg-blue-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <button
                onClick={toggleDarkMode}
                className="relative z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-110"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Amount Input */}
            <div className="mb-6">
              <AmountInput 
                amount={amount}
                onAmountChange={setAmount}
                loading={loading}
                currency={fromCurrency}
              />
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3 md:items-end">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  From
                </label>
                <CurrencySelector
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-center h-full group relative">
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Swap currencies
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
                <button
                  onClick={swapCurrencies}
                  disabled={loading}
                  className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border-2 border-green-500 dark:border-blue-400"
                  aria-label="Swap currencies"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-6 h-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                    />
                  </svg>
                </button>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  To
                </label>
                <CurrencySelector
                  value={toCurrency}
                  onChange={setToCurrency}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Conversion Result */}
            <div className="mt-8">
              <ConversionResult 
                amount={amount}
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                convertedAmount={convertedAmount}
                rate={currentRate}
                loading={loading}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-100 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {lastUpdated && (
                  <span>Last updated: {new Date(lastUpdated).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 space-y-3">
          <p className="font-medium">© {new Date().getFullYear()} Currency-Converter</p>
          <p>Created by <a 
            href="https://github.com/Dorwu-Gabriel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Dorwu-Gabriel
          </a>
          </p>
          
          {/* Social Links */}
          <div className="flex flex-col items-center space-y-3 mt-2">
            <div className="flex items-center space-x-6">
              {/* Gmail */}
              <a 
                href="mailto:mathesond.gabriel90@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                title="Email me"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Email</span>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/dorwu-gabriel-6b34701a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                title="Connect on LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/233243849560?text=Hello%20Gabriel,%20I%20found%20you%20through%20your%20app." 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                title="Chat on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.964-.941 1.162-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.499.1-.202.049-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          
          <p className="pt-2">Exchange rates data provided by <a 
            href="https://apilayer.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            APILayer
          </a></p>
          {lastUpdated && (
            <p className="text-xs opacity-75 mt-2">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
          )}
        </footer>
      </div>
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 dark:border-gray-700/30 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-200">Loading exchange rates...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
