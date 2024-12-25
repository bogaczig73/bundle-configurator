import React from 'react';
import Modal from './Modal';

function SettingsModal({ show, onClose, settings, onSettingChange }) {
  return (
    show && (
      <Modal onClose={onClose}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Table Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Row Selection
              </label>
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => onSettingChange('enableRowSelection', !settings.enableRowSelection)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.enableRowSelection ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                  role="switch"
                  aria-checked={settings.enableRowSelection}
                >
                  <span className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${settings.enableRowSelection ? 'translate-x-5' : 'translate-x-0'}
                  `}/>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Fixace Column
              </label>
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => onSettingChange('showFixace', !settings.showFixace)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.showFixace ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                  role="switch"
                  aria-checked={settings.showFixace}
                >
                  <span className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${settings.showFixace ? 'translate-x-5' : 'translate-x-0'}
                  `}/>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Individual Discount Column
              </label>
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => onSettingChange('showIndividualDiscount', !settings.showIndividualDiscount)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.showIndividualDiscount ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                  role="switch"
                  aria-checked={settings.showIndividualDiscount}
                >
                  <span className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${settings.showIndividualDiscount ? 'translate-x-5' : 'translate-x-0'}
                  `}/>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    )
  );
}

export default SettingsModal; 