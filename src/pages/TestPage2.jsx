import React, { useEffect } from 'react';
import { PDFGenerator } from '../components/PDFGenerator';
import { useConfigData } from '../hooks/useConfigData';
import { flattenItems } from '../utils/tableUtils';
export function TestPage2( {packages, processedItems} ) {

    const { currentConfig, loading, error } = useConfigData(null, '25rfL2kGMGD8eie37eqB');
    const defaultPackages = [
        { id: 1, name: "Basic" },
        { id: 2, name: "Standard" },
        { id: 3, name: "Premium" }
    ];
    const amounts = [
        { id: 1, name: "Basic" },
        { id: 2, name: "Standard" },
        { id: 3, name: "Premium" }
    ];
    
    useEffect(() => {
        console.log('Loading state:', loading);
        console.log('Error state:', error);
        console.log('Current config:', currentConfig);
    }, [loading, error, currentConfig]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    let items = [];
    if(currentConfig) {
        items = flattenItems(currentConfig.items);
        console.log(items);
    }

    return (
        <PDFGenerator packages={defaultPackages} items={items} amounts={amounts} />
    );
    
}

export default TestPage2;