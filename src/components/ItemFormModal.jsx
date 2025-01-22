import React, { useState, useMemo, useEffect, useCallback } from 'react';

function ItemFormModal({ show, onClose, onSubmit, onDelete, items, packages, editingItem = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'item',
    categoryId: '',
    note: '',
    checkbox: false,
    individual: false,
    amount: 0,
    order: 1,
    packages: packages.map(pkg => ({
      packageId: pkg.id,
      price: 0,
      selected: false,
      discountedAmount: 0
    })),
    id: null,
  });

  const categories = useMemo(() => {
    const getCategories = (items, prefix = '') => {
      return items.reduce((acc, item) => {
        if (item.type === 'category') {
          acc.push({
            id: item.id,
            name: prefix + item.name
          });
          if (item.children) {
            acc.push(...getCategories(item.children, prefix + '→ '));
          }
        }
        return acc;
      }, []);
    };
    return getCategories(items);
  }, [items]);

  // Function to get the next available order number for a category
  const getNextOrderNumber = useCallback((categoryId) => {
    // Convert empty string to null for root category
    const targetCategoryId = categoryId === '' ? null : Number(categoryId);
    
    // Get all items in the selected category
    const itemsInCategory = items.reduce((acc, item) => {
      if (item.type === 'category') {
        // For categories, check if it's in the same parent category
        const itemParentId = item.parentId ? Number(item.parentId) : null;
        if (itemParentId === targetCategoryId) {
          acc.push(item);
        }
        // Also check items in all categories
        if (item.children) {
          item.children.forEach(child => {
            if (child.categoryId === targetCategoryId) {
              acc.push(child);
            }
          });
        }
      } else if (item.categoryId === targetCategoryId) {
        // For items, check if they're in the target category
        acc.push(item);
      }
      return acc;
    }, []);

    // Find the highest order number
    const maxOrder = itemsInCategory.reduce((max, item) => {
      const itemOrder = item.order || 0;
      return itemOrder > max ? itemOrder : max;
    }, 0);

    // Return next number (at least 1)
    return Math.max(1, maxOrder + 1);
  }, [items]);

  useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'category') {
        setFormData({
          id: editingItem.id,
          name: editingItem.name,
          type: 'category',
          categoryId: editingItem.parentId || '',
          order: editingItem.order || 1,
        });
      } else {
        setFormData({
          ...editingItem,
          id: editingItem.id,
          order: editingItem.order || 1,
          packages: packages.map(pkg => {
            const existingPackage = editingItem.packages?.find(p => p.packageId === pkg.id);
            return existingPackage || {
              packageId: pkg.id,
              price: 0,
              selected: false,
              discountedAmount: 0
            };
          })
        });
      }
    } else {
      const initialOrder = formData.categoryId ? getNextOrderNumber(formData.categoryId) : 1;
      setFormData(prev => ({
        ...prev,
        name: '',
        type: 'item',
        categoryId: '',
        note: '',
        checkbox: false,
        individual: false,
        amount: 0,
        order: initialOrder,
        packages: packages.map(pkg => ({
          packageId: pkg.id,
          price: 0,
          selected: false,
          discountedAmount: 0
        }))
      }));
    }
  }, [editingItem, packages, getNextOrderNumber]);

  // Update category change handler
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    const nextOrder = getNextOrderNumber(newCategoryId);
    
    setFormData(prev => ({
      ...prev,
      categoryId: newCategoryId,
      order: nextOrder
    }));
  };

  const handlePackageChange = (packageId, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => {
        if (pkg.packageId === packageId) {
          return {
            ...pkg,
            [field]: field === 'selected' ? value : 
                    field === 'note' ? value :
                    Number(value)
          };
        }
        return pkg;
      })
    }));
  };

  useEffect(() => {
    if (formData.individual) {
      setFormData(prev => ({
        ...prev,
        packages: prev.packages.map(pkg => ({
          ...pkg,
          price: 1
        }))
      }));
    }
  }, [formData.individual]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      id: formData.id,
      name: formData.name,
      type: formData.type,
      categoryId: formData.categoryId,
      note: formData.note,
      checkbox: formData.checkbox,
      individual: formData.individual,
      amount: formData.amount,
      order: formData.order,
      packages: formData.packages,
      userLimit: formData.userLimit,
      discountAmount: formData.discountAmount,
      discountType: formData.discountType
    };
    
    onSubmit(submitData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[1000px] max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {editingItem 
              ? `Upravit ${editingItem.type === 'category' ? 'kategorii' : 'položku'}`
              : `Přidat ${formData.type === 'category' ? 'kategorii' : 'položku'}`
            }
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.type === 'item'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'item' }))}
                  className="radio"
                  disabled={editingItem && editingItem.type === 'item'}
                />
                <span>Položka</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.type === 'category'}
                  onChange={() => setFormData(prev => ({ ...prev, type: 'category' }))}
                  className="radio"
                  disabled={editingItem && editingItem.type === 'item'}
                />
                <span>Kategorie</span>
              </label>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Název *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Zadejte název..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorie
                </label>
                <select
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Hlavní kategorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Order Field */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pořadí
                </label>
                <select
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(() => {
                    // Get items in the current category
                    const targetCategoryId = formData.categoryId === '' ? null : Number(formData.categoryId);
                    const itemsInCategory = items.reduce((acc, item) => {
                      if (item.type === 'category') {
                        const itemParentId = item.parentId ? Number(item.parentId) : null;
                        if (itemParentId === targetCategoryId) {
                          acc.push(item);
                        }
                        if (item.children) {
                          item.children.forEach(child => {
                            if (child.categoryId === targetCategoryId) {
                              acc.push(child);
                            }
                          });
                        }
                      } else if (item.categoryId === targetCategoryId) {
                        acc.push(item);
                      }
                      return acc;
                    }, []);

                    // Get max order
                    const maxOrder = itemsInCategory.reduce((max, item) => {
                      const itemOrder = item.order || 0;
                      return itemOrder > max ? itemOrder : max;
                    }, 0);

                    // Generate array of numbers from 1 to maxOrder + 1
                    const orderNumbers = Array.from({ length: maxOrder + 1 }, (_, i) => i + 1);

                    // If editing, include current position if it's higher than maxOrder
                    if (editingItem && editingItem.order > maxOrder) {
                      orderNumbers.push(editingItem.order);
                    }

                    return orderNumbers.map(num => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>

            {formData.type === 'item' && (
              <>
                {/* Item Settings */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Nastavení položky</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poznámka
                      </label>
                      <input
                        type="text"
                        value={formData.note}
                        onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Obecná poznámka k položce..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checkbox}
                        onChange={(e) => setFormData(prev => ({ ...prev, checkbox: e.target.checked }))}
                        className="checkbox"
                      />
                      <span className="text-sm text-gray-700">Ano/Ne položka</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.individual}
                        onChange={(e) => setFormData(prev => ({ ...prev, individual: e.target.checked }))}
                        className="checkbox"
                      />
                      <span className="text-sm text-gray-700">Individuální</span>
                    </label>
                  </div>
                </div>

                {/* Package Pricing Table */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Ceny balíků</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Balík</th>
                          <th className="px-4 py-2 text-center">Povoleno</th>
                          <th className="px-4 py-2 text-center">Cena</th>
                          <th className="px-4 py-2 text-center">Sleva</th>
                          <th className="px-4 py-2 text-left">Poznámka</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {formData.packages.map((pkg) => (
                          <tr key={pkg.packageId}>
                            <td className="px-4 py-2">
                              {packages.find(p => p.id === pkg.packageId)?.name}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={pkg.selected}
                                onChange={(e) => handlePackageChange(pkg.packageId, 'selected', e.target.checked)}
                                className="rounded border-gray-300 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={pkg.price || 0}
                                onChange={(e) => handlePackageChange(pkg.packageId, 'price', e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                                readOnly={formData.individual}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                value={pkg.discountedAmount || 0}
                                onChange={(e) => handlePackageChange(pkg.packageId, 'discountedAmount', e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={pkg.note || ''}
                                onChange={(e) => handlePackageChange(pkg.packageId, 'note', e.target.value)}
                                placeholder="Poznámka..."
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {editingItem && (
            <button 
              onClick={() => onDelete(editingItem.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mazání...
                </>
              ) : 'Smazat položku'}
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zrušit
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!formData.name || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingItem ? 'Ukládání...' : 'Přidávání...'}
                </>
              ) : (
                editingItem ? 'Uložit změny' : 'Přidat'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemFormModal; 