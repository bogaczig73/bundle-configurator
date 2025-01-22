import React from 'react';
import { Link } from 'react-router-dom';

function ActionButtons({ userId, loading, onSave, onExport, onImport, onReset }) {
  return (
    <div className="flex gap-2">
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
            Zrušit
          </Link>
        </>
      ) : (
        <>
          <button onClick={onSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Uložit změny
          </button>
        </>
      )}
    </div>
  );
}

export default ActionButtons; 