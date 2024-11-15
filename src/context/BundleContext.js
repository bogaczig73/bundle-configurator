// context/BundleContext.js

import React, { createContext, useContext, useState } from "react";
import { initialBundles } from "../data/bundles";

const BundleContext = createContext();

export const useBundles = () => useContext(BundleContext);

export const BundleProvider = ({ children }) => {
  // Set up bundles state with initialBundles data structure
  const [bundles, setBundles] = useState(initialBundles);

  return (
    <BundleContext.Provider value={{ bundles, setBundles }}>
      {children}
    </BundleContext.Provider>
  );
};