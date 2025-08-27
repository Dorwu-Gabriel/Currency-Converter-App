// Exchange Rates Data API (APILayer)
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_URL = 'https://api.apilayer.com/exchangerates_data';

if (!API_KEY) {
  const errorMsg = 'Exchange Rate API key is not set. Please check your .env file. Get a free API key from: https://apilayer.com/marketplace/exchangerates_data-api';
  console.error(errorMsg);
  throw new Error(errorMsg);
}

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Invalid JSON response from server' };
    }
    
    const error = new Error(errorData.message || `Failed to fetch exchange rates (${response.status})`);
    error.status = response.status;
    error.data = errorData;
    
    // Handle specific error statuses
    if (response.status === 429) {
      error.message = 'API rate limit exceeded. Please try again later.';
    } else if (response.status === 401) {
      error.message = 'Invalid API key. Please check your configuration.';
    } else if (response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    
    throw error;
  }
  
  try {
    return await response.json();
  } catch (e) {
    throw new Error('Failed to parse server response');
  }
};

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(
      `${BASE_URL}/latest?base=${baseCurrency}`,
      {
        headers: {
          'apikey': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await handleResponse(response);
    
    // The APILayer API returns rates directly in the response
    if (!data.rates) {
      throw new Error(data.message || 'Failed to fetch exchange rates');
    }
    
    return {
      rates: data.rates,
      lastUpdated: new Date().toISOString(),
      base: data.base,
      date: data.date,
    };
  } catch (error) {
    console.error('Error in fetchExchangeRates:', error);
    throw new Error(error.message || 'Failed to fetch exchange rates');
  }
};

// Cache for storing rates to avoid unnecessary API calls
const cache = {
  data: null,
  timestamp: null,
  base: 'USD',
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
  MAX_RETRIES: 3,
  retryCount: 0,
  lastError: null,
};

/**
 * Validates if the cached data is still fresh
 */
const isCacheValid = (baseCurrency) => {
  const now = Date.now();
  return (
    cache.data &&
    cache.timestamp &&
    (now - cache.timestamp) < cache.CACHE_DURATION &&
    cache.base === baseCurrency
  );
};

/**
 * Fetches exchange rates with retry logic
 */
const fetchWithRetry = async (baseCurrency, retries = cache.MAX_RETRIES) => {
  try {
    const data = await fetchExchangeRates(baseCurrency);
    cache.retryCount = 0; // Reset retry count on success
    return data;
  } catch (error) {
    cache.lastError = error;
    
    if (retries > 0) {
      console.warn(`Retrying... (${cache.MAX_RETRIES - retries + 1}/${cache.MAX_RETRIES})`);
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, cache.MAX_RETRIES - retries)));
      return fetchWithRetry(baseCurrency, retries - 1);
    }
    
    throw error;
  }
};

export const getCachedRates = async (baseCurrency = 'USD') => {
  // Return cached data if it's still valid
  if (isCacheValid(baseCurrency)) {
    return cache.data;
  }
  
  try {
    const data = await fetchWithRetry(baseCurrency);
    
    // Update cache
    cache.data = data;
    cache.timestamp = Date.now();
    cache.base = baseCurrency;
    cache.lastError = null;
    
    return data;
  } catch (error) {
    // If there's an error but we have cached data, return that with a warning
    if (cache.data) {
      console.warn('Using potentially stale cached data due to error:', error.message);
      return {
        ...cache.data,
        isStale: true,
        error: `Using cached data: ${error.message}`
      };
    }
    
    // No cached data available, rethrow the error
    throw error;
  }
};

export default {
  fetchExchangeRates,
  getCachedRates,
};
