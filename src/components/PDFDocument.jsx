import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';
Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});
// Register Helvetica font (built-in)
const styles = StyleSheet.create({

  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
    fontFamily: 'Roboto'
  },
  container: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerCell: {
    padding: '4px 4px',
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#1A202C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 25,
    backgroundColor: '#ffffff',
  },
  categoryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    borderBottomColor: '#ffffff',
    minHeight: 25,
  },
  categoryDetailsColumn: {
    width: 140,
    padding: '4px 8px',
    borderBottomWidth: 1,
    borderBottomColor: '#e1007b',
  },
  categoryAmountColumn: {
    width: 50,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1007b',
  },
  categoryFixaceColumn: {
    width: 60,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1007b',
  },
  categoryDiscountColumn: {
    width: 60,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1007b',
  },
  bundleColumn: {
    width: 80,
    padding: '4px 8px',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacerColumn: {
    width: 10,
    backgroundColor: '#FFFFFF',
  },
  itemName: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#4A5568',
  },
  categoryName: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#e1007b',
    justifyContent: 'center',
  },
  itemNote: {
    fontSize: 6,
    fontFamily: 'Roboto',
    color: '#718096',
    marginTop: 2,
  },
  priceText: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#4A5568',
    textAlign: 'center',
  },
  priceNote: {
    fontSize: 6,
    fontFamily: 'Roboto',
    color: '#718096',
    textAlign: 'center',
  },
  bundlePrice: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#1A202C',
    marginTop: 2,
  },
  bundleTotal: {
    fontSize: 6,
    fontFamily: 'Roboto',
    color: '#718096',
    marginTop: 1,
  },
  indentedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  indent: {
    width: 5,
  },
  subItemRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 25,
    backgroundColor: '#F7FAFC',
  },
  indentedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  detailsColumn: {
    width: 140,
    padding: '4px 8px',
    justifyContent: 'center',
  },
  amountColumn: {
    width: 50,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixaceColumn: {
    width: 60,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountColumn: {
    width: 60,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Helper function to get bundle border color
const getBundleBorderColor = (index) => {
  const colors = ['#ffd100', '#ff8200', '#e1007b']; // abraYellow, abraOrange, abraMagenta
  return colors[index % colors.length];
};

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function to create indentation based on depth
const Indent = ({ depth }) => {
  const indents = [];
  for (let i = 0; i < depth; i++) {
    indents.push(<View key={i} style={styles.indent} />);
  }
  return <>{indents}</>;
};

// Helper function to calculate final price
const calculateFinalPrice = (basePrice, type, amounts, parentItem, bundle) => {
  const discountKey = `${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`;
  const packageInfo = parentItem.packages?.find(p => p.packageId === bundle.id);
  const baseItemPrice = packageInfo?.price || 0;
  const discountedAmount = packageInfo?.discountedAmount || 0;
  const discountPercentage = amounts?.discount?.[discountKey] ?? parentItem.discount ?? 0;
  
  let applicableUnits = 0;
  if (type === 'fixace') {
    applicableUnits = amounts?.fixace?.[parentItem.id] || 0;
  } else if (type === 'over') {
    const totalAmount = amounts?.amounts?.[parentItem.id] || 0;
    const fixaceAmount = amounts?.fixace?.[parentItem.id] || 0;
    applicableUnits = Math.max(0, totalAmount - fixaceAmount - discountedAmount);
  }

  const priceAfterDiscount = baseItemPrice * (1 - discountPercentage / 100);
  const finalPrice = priceAfterDiscount * applicableUnits;

  return {
    finalPrice,
    applicableUnits,
    pricePerUnit: baseItemPrice,
    discountedAmount,
    discountPercentage
  };
};

// Helper function to calculate total price for an item including subitems
const calculateTotalPrice = (item, bundle, amounts) => {
  let total = 0;
  
  if (amounts?.amounts?.[item.id] > 0) {
    const packageInfo = item.packages?.find(p => p.packageId === bundle.id);
    if (!packageInfo) return 0;

    // Get the main item discount
    const mainDiscount = amounts?.discount?.[item.id] ?? item.discount ?? 0;

    // Add fixace price
    const fixacePrice = calculateFinalPrice(
      packageInfo.price || 0,
      'fixace',
      amounts,
      item,
      bundle
    ).finalPrice;

    // Add over-fixace price
    const overPrice = calculateFinalPrice(
      packageInfo.price || 0,
      'over',
      amounts,
      item,
      bundle
    ).finalPrice;

    // Apply main item discount to the total
    total = (fixacePrice + overPrice) * (1 - mainDiscount / 100);
  }

  return total;
};

export const PDFDocument = ({ packages, items, amounts, currentConfig, showFixace = false, showIndividualDiscount = false }) => {
  if (!items || !packages) return null;

  // Calculate total price for each bundle
  const calculateBundleTotal = (bundle) => {
    let total = 0;
    flattenedItems.forEach(item => {
      if (item.type === 'item') {
        total += calculateTotalPrice(item, bundle, amounts);
      }
    });
    return total;
  };

  // Flatten items while preserving hierarchy
  const flattenItems = (items, depth = 0) => {
    return items.reduce((acc, item) => {
      acc.push({ ...item, depth });
      if (item.children && Array.isArray(item.children)) {
        acc.push(...flattenItems(item.children, depth + 1));
      }
      return acc;
    }, []);
  };

  const flattenedItems = flattenItems(items);

  // Helper function to get item amount
  const getItemAmount = (itemId) => {
    return amounts?.amounts?.[itemId] || '-';
  };

  // Helper function to get fixace amount
  const getFixaceAmount = (itemId) => {
    return amounts?.fixace?.[itemId] || '-';
  };

  // Helper function to get discount
  const getDiscount = (itemId) => {
    const discount = amounts?.discount?.[itemId];
    return discount ? `${discount}%` : '-';
  };

  // Helper function to get item price for a bundle
  const getItemPrice = (item, bundleId) => {
    if (!item.packages) return '-';
    const pkg = item.packages.find(p => p.packageId === bundleId);
    return pkg?.price ?? '-';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <View style={styles.detailsColumn}>
              <Text style={styles.headerCell}>Název položky</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.headerCell}>Počet</Text>
            </View>
            {showFixace && (
              <View style={styles.fixaceColumn}>
                <Text style={styles.headerCell}>Fixace</Text>
              </View>
            )}
            {showIndividualDiscount && (
              <View style={styles.discountColumn}>
                <Text style={styles.headerCell}>Slevy</Text>
              </View>
            )}
            {packages.map((bundle, index) => (
              <React.Fragment key={bundle.id}>
                <View style={styles.spacerColumn} />
                <View style={[
                  styles.bundleColumn,
                  { borderColor: getBundleBorderColor(index) }
                ]}>
                  <Text style={styles.headerCell}>{bundle.name}</Text>
                  <Text style={styles.bundlePrice}>
                    {formatPrice(calculateBundleTotal(bundle))}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Table Rows */}
          {flattenedItems.map((item) => (
            <React.Fragment key={item.id || item.uniqueId}>
              {/* Main Item Row */}
              <View key={item.id || item.uniqueId} style={[
                item.type === 'category' ? styles.categoryRow : styles.tableRow
              ]}>
                {/* Details Column */}
                <View style={item.type === 'category' ? styles.categoryDetailsColumn : styles.detailsColumn}>
                  <View style={styles.indentedContent}>
                    <Indent depth={item.depth} />
                    <View style={{ flex: 1 }}>
                      <Text style={item.type === 'category' ? styles.categoryName : styles.itemName}>
                        {item.name}
                      </Text>
                      {item.note && (
                        <Text style={styles.itemNote}>{item.note}</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Amount Column */}
                <View style={item.type === 'category' ? styles.categoryAmountColumn : styles.amountColumn}>
                  <Text style={styles.priceText}>
                    {getItemAmount(item.id)}
                  </Text>
                </View>

                {/* Fixace Column */}
                {showFixace && (
                  <View style={item.type === 'category' ? styles.categoryFixaceColumn : styles.fixaceColumn}>
                    <Text style={styles.priceText}>
                      {getFixaceAmount(item.id)}
                    </Text>
                  </View>
                )}

                {/* Individual Discount Column */}
                {showIndividualDiscount && (
                  <View style={item.type === 'category' ? styles.categoryDiscountColumn : styles.discountColumn}>
                    <Text style={styles.priceText}>
                      {getDiscount(item.id)}
                    </Text>
                  </View>
                )}

                {/* Bundle Columns */}
                {packages.map((bundle, index) => (
                  <React.Fragment key={`${item.id}-${bundle.id}`}>
                    <View style={styles.spacerColumn} />
                    <View style={[
                      styles.bundleColumn,
                      { borderColor: getBundleBorderColor(index) }
                    ]}>
                      {item.type === 'item' && (
                        <View>
                          <Text style={styles.priceText}>
                            {formatPrice(calculateTotalPrice(item, bundle, amounts))}
                          </Text>
                        </View>
                      )}
                    </View>
                  </React.Fragment>
                ))}
              </View>

              {/* Subitem Rows */}
              {showFixace && item.type === 'item' && amounts?.amounts?.[item.id] > 0 && (
                <>
                  {/* Fixace Row */}
                  <View style={styles.subItemRow}>
                    <View style={styles.detailsColumn}>
                      <View style={styles.indentedContent}>
                        <Indent depth={item.depth + 1} />
                        <Text style={styles.itemName}>Fixované položky</Text>
                      </View>
                    </View>

                    <View style={styles.amountColumn}>
                    <Text style={styles.priceText}>-</Text>
                    </View>

                    {showFixace && (
                      <View style={styles.fixaceColumn}>
                        <Text style={styles.priceText}>{amounts?.fixace?.[item.id] || '-'}</Text>
                      </View>
                    )}

                    {showIndividualDiscount && (
                      <View style={styles.discountColumn}>
                        <Text style={styles.priceText}>
                          {amounts?.discount?.[`${item.id}_fixed_items`] || item.discount || '0'}%
                        </Text>
                      </View>
                    )}

                    {packages.map((bundle, index) => (
                      <React.Fragment key={`fixace-${item.id}-${bundle.id}`}>
                        <View style={styles.spacerColumn} />
                        <View style={[
                          styles.bundleColumn,
                          { borderColor: getBundleBorderColor(index) }
                        ]}>
                          <Text style={styles.priceText}>
                            {formatPrice(calculateFinalPrice(
                              0, // basePrice is not used anymore
                              'fixace',
                              amounts,
                              item,
                              bundle
                            ).finalPrice)}
                          </Text>
                          {item.packages?.find(p => p.packageId === bundle.id)?.discountedAmount > 0 && (
                            <Text style={styles.priceNote}>
                              {`První ${item.packages.find(p => p.packageId === bundle.id).discountedAmount} v ceně`}
                            </Text>
                          )}
                        </View>
                      </React.Fragment>
                    ))}
                  </View>

                  {/* Over Fixace Row */}
                  <View style={styles.subItemRow}>
                    <View style={styles.detailsColumn}>
                      <View style={styles.indentedContent}>
                        <Indent depth={item.depth + 1} />
                        <Text style={styles.itemName}>Položky nad fixací</Text>
                      </View>
                    </View>

                    <View style={styles.amountColumn}>
                      <Text style={styles.priceText}>
                        {Math.max(0, (amounts?.amounts?.[item.id] || 0) - (amounts?.fixace?.[item.id] || 0))}
                      </Text>
                    </View>

                    {showFixace && (
                      <View style={styles.fixaceColumn}>
                        <Text style={styles.priceText}>-</Text>
                      </View>
                    )}

                    {showIndividualDiscount && (
                      <View style={styles.discountColumn}>
                        <Text style={styles.priceText}>
                          {amounts?.discount?.[`${item.id}_over_fixation_items`] || item.discount || '0'}%
                        </Text>
                      </View>
                    )}

                    {packages.map((bundle, index) => (
                      <React.Fragment key={`over-${item.id}-${bundle.id}`}>
                        <View style={styles.spacerColumn} />
                        <View style={[
                          styles.bundleColumn,
                          { borderColor: getBundleBorderColor(index) }
                        ]}>
                          <Text style={styles.priceText}>
                            {formatPrice(calculateFinalPrice(
                              0, // basePrice is not used anymore
                              'over',
                              amounts,
                              item,
                              bundle
                            ).finalPrice)}
                          </Text>
                          {item.packages?.find(p => p.packageId === bundle.id)?.discountedAmount > 0 && (
                            <Text style={styles.priceNote}>
                              {`First ${item.packages.find(p => p.packageId === bundle.id).discountedAmount} in price`}
                            </Text>
                          )}
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                </>
              )}
            </React.Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
}; 