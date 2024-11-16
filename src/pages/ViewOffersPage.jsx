import React, { useState, useEffect } from "react";
import { defaultItems as items } from "../data/items";
import { Link, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { flattenItems } from '../utils/itemUtils';

// Bundle Picker Component - made more compact
const BundlePicker = ({ bundles, users, selectedBundle, onBundleSelect }) => (
  <div className="p-2 bg-white border-b">
    <div className="flex space-x-2 overflow-x-auto">
      {bundles.map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => onBundleSelect(bundle)}
          className={`p-3 rounded-lg cursor-pointer border min-w-[180px] ${
            selectedBundle?.id === bundle.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="font-medium text-sm">
            {users[bundle.userId]?.username || 'Unknown User'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total: {bundle.totalPrice || 0} CZK
          </div>
          <div className="mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              bundle.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {bundle.status || 'draft'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Table Components - made more compact
const HeaderRow = ({ packages }) => (
  <>
    <div className="font-semibold p-2 bg-white border-b sticky top-0 z-10 text-sm">Items</div>
    <div className="font-semibold p-2 bg-white border-b text-center sticky top-0 z-10 text-sm">Amount</div>
    {packages.map(pkg => (
      <div 
        key={pkg.id} 
        className="font-semibold p-2 bg-white border-b text-center sticky top-0 z-10 text-sm"
      >
        <div>{pkg.name}</div>
        <div className="text-sm text-gray-600 mt-1">
          {pkg.totalPrice || 0} CZK
        </div>
      </div>
    ))}
  </>
);

const ItemRow = ({ item, amounts, packages, calculateItemTotal, indent = false }) => (
  <>
    <div className={`p-2 border-b ${indent ? 'pl-6' : ''}`}>
      <div className="text-sm truncate">{item.name}</div>
      {item.note && <div className="text-xs text-gray-500 truncate">{item.note}</div>}
    </div>
    <div className="p-2 border-b text-center text-sm">
      {amounts[item.id] || 0}
    </div>
    {packages.map(pkg => (
      <div key={pkg.id} className="p-2 border-b text-center text-sm">
        {calculateItemTotal(pkg.id, item.id)} CZK
      </div>
    ))}
  </>
);

const TotalsRow = ({ packages }) => (
  <div className="col-span-full grid" style={{ 
    gridTemplateColumns: `minmax(300px, 2fr) minmax(150px, 1fr) repeat(${packages.length}, minmax(200px, 1fr))` 
  }}>
    <div className="p-4 font-bold bg-gray-100">Total</div>
    <div className="p-4 font-bold bg-gray-100 text-center"></div>
    {packages.map(pkg => (
      <div key={pkg.id} className="p-4 font-bold bg-gray-100 text-center">
        {pkg.totalPrice || 0} CZK
      </div>
    ))}
  </div>
);

// Main Component
function ViewOffersPage() {
  const [bundles, setBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState({});
  const [amounts, setAmounts] = useState(() => JSON.parse(localStorage.getItem('amounts')) || {});
  
  const { userId } = useParams();
  const location = useLocation();
  const bundleId = new URLSearchParams(location.search).get('bundleId');

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      try {
        const bundlesSnapshot = await getDocs(collection(db, 'bundles'));
        const bundlesData = [];
        const usersData = {};

        for (const bundleDoc of bundlesSnapshot.docs) {
          const bundleData = bundleDoc.data();
          console.log('Bundle Data:', {
            id: bundleDoc.id,
            ...bundleData
          });
          
          if (!usersData[bundleData.userId]) {
            const userDoc = await getDoc(doc(db, 'users', bundleData.userId));
            if (userDoc.exists()) {
              usersData[bundleData.userId] = userDoc.data();
              console.log('User Data for', bundleData.userId, ':', userDoc.data());
            }
          }
          
          bundlesData.push({
            id: bundleDoc.id,
            ...bundleData
          });
        }

        setBundles(bundlesData);
        setUsers(usersData);
        if (bundlesData.length > 0) {
          setSelectedBundle(bundlesData[0]);
        }
      } catch (err) {
        console.error('Error fetching bundles:', err);
        setError('Failed to load bundles');
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
  }, []);

  const handleAmountChange = (itemId, amount) => {
    setAmounts(prev => ({ ...prev, [itemId]: Number(amount) }));
  };

  const calculateItemTotal = (packageId, itemId) => {
    if (!selectedBundle?.packages) return 0;
    const pkg = selectedBundle.packages.find(p => p.id === packageId);
    const amount = amounts[itemId] || 0;
    return pkg?.items?.[itemId]?.selected ? (pkg.items[itemId].price * amount) : 0;
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col">
        <BundlePicker 
          bundles={bundles}
          users={users}
          selectedBundle={selectedBundle}
          onBundleSelect={setSelectedBundle}
        />
        
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {selectedBundle && selectedBundle.packages && (
            <div className="h-[calc(100vh-200px)] overflow-y-auto relative">
              <div className="grid" style={{ 
                gridTemplateColumns: `minmax(300px, 2fr) minmax(150px, 1fr) repeat(${selectedBundle.packages.length}, minmax(200px, 1fr))` 
              }}>
                <HeaderRow packages={selectedBundle.packages} />
                {flattenItems(items).map(item => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    amounts={amounts}
                    packages={selectedBundle.packages}
                    calculateItemTotal={calculateItemTotal}
                    indent={!!item.subcategoryId}
                  />
                ))}
                <TotalsRow packages={selectedBundle.packages} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewOffersPage; 

