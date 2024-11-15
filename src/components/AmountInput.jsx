import React from 'react';

function AmountInput({ value, onChange }) {
  return (
    <div className="p-2 border-b bg-white flex justify-center items-center gap-2">
      <button
        onClick={() => onChange((value || 0) - 1)}
        disabled={(value || 0) <= 0}
        className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
      >
        -
      </button>
      <input
        type="number"
        min="0"
        value={value || 0}
        onChange={(e) => onChange(e.target.value)}
        className="form-input w-16 text-sm border-gray-300 rounded text-center"
      />
      <button
        onClick={() => onChange((value || 0) + 1)}
        className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
      >
        +
      </button>
    </div>
  );
}

export default AmountInput; 