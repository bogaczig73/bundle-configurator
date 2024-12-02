import React, { useState, useMemo, useEffect } from 'react';

function ItemFormModal({ show, onClose, onSubmit, items, packages, editingItem = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'item',
    categoryId: '',
    note: '',
    checkbox: false,
    individual: false,
    amount: 0,
    packages: packages.map(pkg => ({
      packageId: pkg.id,
      price: 0,
      selected: false,
      discountedAmount: 0
    })),
    id: null,
    userLimit: 0,
    discountAmount: 0,
    discountType: 'percentage'
  });

  useEffect(() => {
    console.log('Items prop:', items);
  }, [items]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        discountType: editingItem.discountType || 'percentage',
        userLimit: editingItem.userLimit || 0,
        discountAmount: editingItem.discountAmount || 0,
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
    } else {
      setFormData({
        name: '',
        type: 'item',
        categoryId: '',
        note: '',
        checkbox: false,
        individual: false,
        amount: 0,
        userLimit: 0,
        discountAmount: 0,
        discountType: 'percentage',
        packages: packages.map(pkg => ({
          packageId: pkg.id,
          price: 0,
          selected: false,
          discountedAmount: 0
        }))
      });
    }
  }, [editingItem, packages]);

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

  const handlePackageChange = (packageId, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => {
        if (pkg.packageId === packageId) {
          return {
            ...pkg,
            [field]: field === 'selected' ? value : Number(value)
          };
        }
        return pkg;
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      name: formData.name,
      type: formData.type,
      categoryId: formData.categoryId,
      note: formData.note,
      checkbox: formData.checkbox,
      individual: formData.individual,
      amount: formData.amount,
      packages: formData.packages,
      userLimit: formData.userLimit,
      discountAmount: formData.discountAmount,
      discountType: formData.discountType
    };
    
    console.log('Modal submitting:', submitData);
    onSubmit(submitData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h2>
        
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name * uaaaas</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
            <label className="block mb-1">Parent Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Root Level</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={editingItem}
              >
                <option value="item">Item</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {formData.type === 'item' && (
            <>
              {/* Item Specific Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Note</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* User Limit and Discount Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">User Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.userLimit || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, userLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.amount || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Discount Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Discount Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountAmount || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.checkbox}
                    onChange={(e) => setFormData(prev => ({ ...prev, checkbox: e.target.checked }))}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  Checkbox
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.individual}
                    onChange={(e) => setFormData(prev => ({ ...prev, individual: e.target.checked }))}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  Individual
                </label>
              </div>

              {/* Package Pricing Table */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Package Settings</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Package</th>
                        <th className="px-4 py-2 text-center">Selected</th>
                        <th className="px-4 py-2 text-center">Price</th>
                        <th className="px-4 py-2 text-center">Discounted Amount</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {formData.type === 'category' && (
            <>
              {/* Category Specific Fields */}
              {/* Remove duplicate parent category selector here */}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!formData.name}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {editingItem ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemFormModal; 