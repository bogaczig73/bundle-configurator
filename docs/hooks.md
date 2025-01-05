# Custom Hooks

## useConfigData

Custom hook for managing configuration data in the bundle configurator.

## Usage

```jsx
import { useConfigData } from 'src/hooks/useConfigData';

function MyComponent() {
  const { data, loading, error } = useConfigData();
  // ...
}
``` 