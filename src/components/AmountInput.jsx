import React from 'react';

const AmountInput = ({ amount, onAmountChange, loading, currency }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Amount
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
            {currency}
          </span>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="block w-full pl-16 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default AmountInput;
