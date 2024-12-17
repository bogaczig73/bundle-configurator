import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import crossIcon from '../images/symbols/Zapor_znamenko.svg';
import React from 'react';

// Create styles matching your table design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  container: {
    minWidth: 800,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  headerCell: {
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A202C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 40,
    backgroundColor: '#ffffff',
  },
  categoryRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#e1007b', // abraMagenta
  },
  detailsColumn: {
    width: 200,
    padding: '8px 16px',
  },
  amountColumn: {
    width: 120,
    padding: '8px 16px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bundleColumn: {
    width: 120,
    padding: '8px 16px',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacerColumn: {
    width: 20,
  },
  itemName: {
    fontSize: 12,
    color: '#4A5568',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e1007b', // abraMagenta
  },
  itemNote: {
    fontSize: 10,
    color: '#718096',
    marginTop: 4,
  },
  priceText: {
    fontSize: 10,
    fontWeight: 'medium',
  },
  priceNote: {
    fontSize: 10,
    color: '#718096',
    textAlign: 'center',
  },
  checkmark: {
    color: '#48BB78',
    fontSize: 16,
  },
  cross: {
    color: '#E53E3E',
    fontSize: 16,
  },
});

// Helper function to get bundle border color
const getBundleBorderColor = (index) => {
  const colors = ['#ffd100', '#ff8200', '#e1007b']; // abraYellow, abraOrange, abraMagenta
  return colors[index % colors.length];
};

export const PDFDocument = ({ packages, items, amounts, currentConfig }) => {
    console.log(currentConfig);
    console.log(packages);
    console.log(amounts);
    if (!items) return null; 
    console.log(currentConfig);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <View style={styles.detailsColumn}>
              <Text style={styles.headerCell}>Details</Text>
            </View>
            <View style={styles.amountColumn}>
              <Text style={styles.headerCell}>Amount</Text>
            </View>
            {packages.map((bundle, index) => (
              <React.Fragment key={bundle.id}>
                <View style={styles.spacerColumn} />
                <View style={[
                  styles.bundleColumn,
                  { borderColor: getBundleBorderColor(index) }
                ]}>
                  <Text style={styles.headerCell}>{bundle.name}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Table Rows */}
          {items.map((item) => (
            <View key={item.id} style={[
              styles.tableRow,
              item.type === 'category' && styles.categoryRow
            ]}>
              {/* Details Column */}
              <View style={styles.detailsColumn}>
                <Text style={item.type === 'category' ? styles.categoryName : styles.itemName}>
                  {item.name}
                </Text>
                {item.note && (
                  <Text style={styles.itemNote}>{item.note}</Text>
                )}
              </View>

              {/* Amount Column */}
              <View style={styles.amountColumn}>
                <Text>{item.amount || '-'}</Text>
              </View>

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
                          {item.prices?.[bundle.id] || '-'}
                        </Text>
                        {item.prices?.[bundle.id] && (
                          <Text style={styles.priceNote}>
                            per unit
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