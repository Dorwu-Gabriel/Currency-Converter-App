import React from 'react';

const ConversionResult = ({ 
  amount, 
  fromCurrency, 
  toCurrency, 
  convertedAmount, 
  rate,
  lastUpdated,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
        <p className="text-red-700 dark:text-red-300">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {convertedAmount} {toCurrency}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          1 {fromCurrency} = {rate} {toCurrency}
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Rates as of: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversionResult;
