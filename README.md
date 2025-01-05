# Bundle Configurator

A React application for configuring and managing product bundles.

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── data/          # Data files and constants
├── api/           # API related code
├── context/       # React context providers
└── types/         # TypeScript type definitions
```

## Key Components

- `BundleTable`: Main component for displaying and managing bundles
- `PDFDocument`: Component for generating PDF documents
- `SettingsModal`: Configuration settings interface
- `ItemFormModal`: Form for adding/editing items

## Custom Hooks

- `useConfigData`: Manages configuration data and state
- `useTableStyles`: Custom styling hook for tables

## Pages

- `ConfiguratorPage`: Main bundle configuration interface
- `ViewOffersPage`: Display available offers
- `BundleSettingsPage`: Bundle settings management
- `PrintPage`: PDF generation and printing interface
- `HomePage`: Application landing page

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Documentation

To view the component documentation:

1. Start the documentation server:
   ```bash
   npm run docs
   ```

2. Build static documentation:
   ```bash
   npm run docs:build
   ```

The documentation will be available at http://localhost:6060
