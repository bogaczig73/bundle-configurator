import React from 'react';
import { Link } from 'react-router-dom';

function ActionButtons({ userId, loading, onSave, onExport, onImport, onReset }) {
  return (
    <div className="flex gap-2 mb-6">
      {userId ? (
        <>
          <button 
            onClick={onSave}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Go to Configuration'}
          </button>
          <Link 
            to="/users"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </Link>
        </>
      ) : (
        <>
          <button onClick={onSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
          <button onClick={onExport} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Export to File
          </button>
          <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            Import from File
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
          <button onClick={onReset} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Reset to Defaults
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons; 