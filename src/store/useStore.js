import { create } from 'zustand';
import { getCachedRates } from '../services/api';

const store = (set, get) => ({
  // State
  amount: 1,
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  exchangeRates: {},
  loading: false,
  error: null,
  lastUpdated: null,
  timeNextUpdate: null,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  
  // Actions
  setAmount: (value) => {
    // Handle empty string or invalid input
    if (value === '' || isNaN(value)) {
      return set({ amount: 0 });
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    // Update the amount
    set({ amount: numValue });
    
    // Get current state
    const { exchangeRates } = get();
    
    // If we have rates, trigger a re-render by updating a timestamp
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      set({ lastUpdated: new Date().toISOString() });
    }
  },
  setFromCurrency: (currency) => set({ fromCurrency: currency }),
  setToCurrency: (currency) => set({ toCurrency: currency }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  
  // Swap currencies
  swapCurrencies: () => set((state) => ({
    fromCurrency: state.toCurrency,
    toCurrency: state.fromCurrency
  })),
  
  // Fetch exchange rates with error handling and stale data support
  fetchExchangeRates: async () => {
    const { fromCurrency } = get();
    set({ loading: true, error: null });
    
    try {
      const result = await getCachedRates(fromCurrency);
      
      // Check if we're using stale data
      if (result.isStale) {
        console.warn('Using stale exchange rate data');
      }
      
      set({
        exchangeRates: result.rates || {},
        lastUpdated: result.date || new Date().toISOString(),
        loading: false,
        error: result.error || null,
        isStale: result.isStale || false
      });
      
      return result.rates || {};
    } catch (error) {
      console.error('Error in fetchExchangeRates:', error);
      const errorMessage = error.status === 429 
        ? 'API rate limit exceeded. Please try again later.'
        : error.message || 'Failed to fetch exchange rates';
      
      set({ 
        error: errorMessage,
        loading: false,
        isStale: false
      });
      
      // Re-throw the error for error boundaries
      throw new Error(errorMessage);
    }
  },
  
  // Calculate converted amount
  getConvertedAmount: () => {
    const state = get();
    const { amount, fromCurrency, toCurrency, exchangeRates } = state;
    
    if (!exchangeRates || !exchangeRates[toCurrency] || fromCurrency === toCurrency) {
      return (parseFloat(amount) || 0).toFixed(2);
    }
    
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const result = (parseFloat(amount) || 0) * rate;
    
    // Format the result to show appropriate decimal places
    if (result >= 1000) {
      return result.toFixed(2);
    } else if (result >= 1) {
      return result.toFixed(4);
    } else {
      return result.toFixed(6);
    }
  },
  
  // Get exchange rate for the current pair
  getCurrentRate: () => {
    const { fromCurrency, toCurrency, exchangeRates } = get();
    
    if (!exchangeRates || !exchangeRates[toCurrency] || fromCurrency === toCurrency) {
      return '1.00';
    }
    
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    
    // Format the rate to show appropriate decimal places
    if (rate >= 1000) {
      return rate.toFixed(2);
    } else if (rate >= 1) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(6);
    }
  },
  
  // Format currency amount with proper formatting
  formatCurrency: (value, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  }
});

export const useStore = create(store);

export const getConvertedAmount = (state) => {
  const { amount, fromCurrency, toCurrency, exchangeRates } = state;
  
  if (!exchangeRates || !exchangeRates[toCurrency] || fromCurrency === toCurrency) {
    return (parseFloat(amount) || 0).toFixed(2);
  }
  
  const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  const result = (parseFloat(amount) || 0) * rate;
  
  // Format the result to show appropriate decimal places
  if (result >= 1000) {
    return result.toFixed(2);
  } else if (result >= 1) {
    return result.toFixed(4);
  } else {
    return result.toFixed(6);
  }
};
