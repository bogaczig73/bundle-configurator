import React from "react";
import { Link } from "react-router-dom";
import { useBundles } from "../context/BundleContext";
import { items, itemsFlat, categories, flatItems, items2 } from "../data/items";
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
// Helper function to calculate total price
const calculateTotalPrice = (bundleItems) => {
  return items.reduce((sum, item) => {
    const bundleItem = bundleItems[item.id];
    if (bundleItem.selected) {
      // return sum + bundleItem.quantity * item.price;
    }
    return sum;
  }, 0);
};

// Add these functions after the calculateTotalPrice helper and before the HomePage component
const uploadDefaultData = async () => {
  const db = getFirestore();
  
  try {
    // Upload categories
    await setDoc(doc(db, 'default', 'categories'), {
      categories: categories
    });

    // Upload flatItems
    await setDoc(doc(db, 'default', 'items'), {
      items: items2 // Using the imported items from data/items
    });

    console.log('Default data uploaded successfully');
  } catch (error) {
    console.error('Error uploading default data:', error);
  }
};

function HomePage() {
  const { bundles, setBundles } = useBundles();

  // Update quantity for an item in a specific bundle
  const handleQuantityChange = (bundleId, itemId, quantity) => {
    setBundles((prevBundles) =>
      prevBundles.map((bundle) =>
        bundle.id === bundleId
          ? {
              ...bundle,
              items: {
                ...bundle.items,
                [itemId]: {
                  ...bundle.items[itemId],
                  quantity: Number(quantity),
                },
              },
            }
          : bundle
      )
    );
  };

  return (
    <div className="p-8 text-center">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4">Bundle Configurator</h1>
      
      <button
        onClick={uploadDefaultData}
        className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
      >
        Upload Default Data
      </button>

      <div className="grid gap-6 md:grid-cols-3">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="border p-4 rounded-lg shadow-lg">
            <h2 className="font-semibold text-lg">{bundle.name}</h2>

            {/* Display total price based on (quantity * price) for selected items */}
            <p className="text-gray-500 mt-2">
              Total Price: ${calculateTotalPrice(bundle.items)}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold">Items</h3>
              {items.map((item) => {
                const bundleItem = bundle.items[item.id];
                if (bundleItem.selected) {
                  return (
                    <div key={item.id} className="flex items-center space-x-2">
                      <span>{item.name}</span>
                      <span className="text-gray-500 ml-auto">
                        ${item.price} x
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={bundleItem.quantity}
                        onChange={(e) =>
                          handleQuantityChange(bundle.id, item.id, e.target.value)
                        }
                        className="w-16 p-1 border rounded mx-2"
                      />
                      <span className="text-gray-700 font-semibold">
                        = ${bundleItem.quantity}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/configure"
        className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Configure Bundles
      </Link>
    </div>
  );
}

export default HomePage;