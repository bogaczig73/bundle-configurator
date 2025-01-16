import React from 'react';
import Modal from './Modal';
import { defaultCategories } from '../data/categories';

// Helper function to organize categories hierarchically
const organizeCategories = (categories) => {
  const categoryMap = new Map();
  const rootCategories = [];

  // First, create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Then, organize them into a tree structure
  categories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id);
    if (category.parentId === null) {
      rootCategories.push(categoryWithChildren);
    } else {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
};

// Component to render a category and its children
const CategoryItem = ({ category, depth = 0, selectedCategories, onSettingChange }) => {
  return (
    <>
      <div 
        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id={`category-${category.id}`}
            checked={selectedCategories?.[category.id] || false}
            onChange={(e) => onSettingChange('preselectCategory', { categoryId: category.id, checked: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700 cursor-pointer">
            {category.name}
          </label>
        </div>
      </div>
      {category.children?.map(child => (
        <CategoryItem
          key={child.id}
          category={child}
          depth={depth + 1}
          selectedCategories={selectedCategories}
          onSettingChange={onSettingChange}
        />
      ))}
    </>
  );
};

function SettingsModal({ show, onClose, settings, onSettingChange, page = 'configurator' }) {
  const organizedCategories = React.useMemo(() => organizeCategories(defaultCategories), []);
  const isConfigurator = page === 'configurator';

  return (
    show && (
      <Modal onClose={onClose}>
        <div className="p-6 w-[800px] max-w-[90vw]">
          <h2 className="text-xl font-bold mb-4">Nastavení tabulky</h2>
          <div className="space-y-4">
            {!isConfigurator && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                      Povolit výběr řádků pro zobrazení
                  </label>
                  <div className="relative inline-flex items-center">
                    <button
                      onClick={() => onSettingChange('enableRowSelection', !settings.enableRowSelection)}
                      className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
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

                {/* Preselect options - only show when row selection is enabled */}
                {settings.enableRowSelection && (
                  <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">Položky s nenulovým množstvím</span>
                        <button
                          onClick={() => onSettingChange('preselectNonZeroPrices', true)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Vybrat
                        </button>
                      </div>
                      
                      {/* Category selection */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Vybrat položky podle kategorie:</p>
                          <button
                            onClick={() => {
                              const allSelected = Object.keys(settings.selectedCategories || {}).length === defaultCategories.length;
                              const newCategories = {};
                              defaultCategories.forEach(cat => {
                                newCategories[cat.id] = !allSelected;
                              });
                              onSettingChange('preselectAllCategories', newCategories);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {Object.keys(settings.selectedCategories || {}).length === defaultCategories.length ? 'Odznačit vše' : 'Vybrat vše'}
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                          {organizedCategories.map((category) => (
                            <CategoryItem
                              key={category.id}
                              category={category}
                              selectedCategories={settings.selectedCategories}
                              onSettingChange={onSettingChange}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Položky zdarma v bundle:</p>
                        {settings.bundles?.map((bundle, index) => (
                          <div key={bundle.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`bundle-${bundle.id}`}
                                checked={settings.selectedBundles?.[bundle.id] || false}
                                onChange={(e) => onSettingChange('preselectFreeItems', { bundleId: bundle.id, checked: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`bundle-${bundle.id}`} className="text-sm text-gray-700 cursor-pointer">
                                {bundle.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
              Zobrazit sloupec: Fixace
              </label>
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => onSettingChange('showFixace', !settings.showFixace)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
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
                Zobrazit sloupec: Individuální slevy
              </label>
              <div className="relative inline-flex items-center">
                <button
                  onClick={() => onSettingChange('showIndividualDiscount', !settings.showIndividualDiscount)}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
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
              Zavřít
            </button>
          </div>
        </div>
      </Modal>
    )
  );
}

export default SettingsModal; 