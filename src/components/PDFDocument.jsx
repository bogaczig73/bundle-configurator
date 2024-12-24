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
    padding: 20,
    fontFamily: 'Roboto'
  },
  container: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  headerCell: {
    padding: '4px 8px',
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#1A202C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 25,
    backgroundColor: '#ffffff',
  },
  categoryRow: {
    backgroundColor: '#F7FAFC',
  },
  detailsColumn: {
    width: 140,
    padding: '4px 8px',
  },
  amountColumn: {
    width: 40,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixaceColumn: {
    width: 40,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountColumn: {
    width: 40,
    padding: '4px 8px',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  itemName: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#4A5568',
  },
  categoryName: {
    fontSize: 8,
    fontFamily: 'Roboto',
    color: '#1A202C',
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
  },
  indent: {
    width: 10,
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

// Helper function to convert text with Czech characters to Unicode escape sequences
const czechToUnicode = (text) => {
  return text
    .replace(/á/g, '\u00E1')
  
};

export const PDFDocument = ({ packages, items, amounts, currentConfig, showFixace = false, showIndividualDiscount = false }) => {
  if (!items || !packages) return null;

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
              <Text style={styles.headerCell}>{czechToUnicode('Název položky')}</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.headerCell}>{czechToUnicode('Množství')}</Text>
            </View>
            {showFixace && (
              <View style={styles.fixaceColumn}>
                <Text style={styles.headerCell}>{czechToUnicode('Fixace')}</Text>
              </View>
            )}
            {showIndividualDiscount && (
              <View style={styles.discountColumn}>
                <Text style={styles.headerCell}>{czechToUnicode('Slevy')}</Text>
              </View>
            )}
            {packages.map((bundle, index) => (
              <React.Fragment key={bundle.id}>
                <View style={styles.spacerColumn} />
                <View style={[
                  styles.bundleColumn,
                  { borderColor: getBundleBorderColor(index) }
                ]}>
                  <Text style={styles.headerCell}>{czechToUnicode(bundle.name)}</Text>
                  <Text style={styles.bundlePrice}>
                    {formatPrice(bundle.totalPrice || 0)}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Table Rows */}
          {flattenedItems.map((item) => (
            <View key={item.id || item.uniqueId} style={[
              styles.tableRow,
              item.type === 'category' && styles.categoryRow
            ]}>
              {/* Details Column */}
              <View style={styles.detailsColumn}>
                <View style={styles.indentedContent}>
                  <Indent depth={item.depth} />
                  <View style={{ flex: 1 }}>
                    <Text style={item.type === 'category' ? styles.categoryName : styles.itemName}>
                      {czechToUnicode(item.name)}
                    </Text>
                    {item.note && (
                      <Text style={styles.itemNote}>{czechToUnicode(item.note)}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Amount Column */}
              <View style={styles.amountColumn}>
                <Text style={styles.priceText}>
                  {getItemAmount(item.id)}
                </Text>
              </View>

              {/* Fixace Column */}
              {showFixace && (
                <View style={styles.fixaceColumn}>
                  <Text style={styles.priceText}>
                    {getFixaceAmount(item.id)}
                  </Text>
                </View>
              )}

              {/* Individual Discount Column */}
              {showIndividualDiscount && (
                <View style={styles.discountColumn}>
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
                          {getItemPrice(item, bundle.id) !== '-' ? formatPrice(getItemPrice(item, bundle.id)) : '-'}
                        </Text>
                        {getItemPrice(item, bundle.id) !== '-' && (
                          <Text style={styles.priceNote}>
                            {czechToUnicode('za kus')}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}; 