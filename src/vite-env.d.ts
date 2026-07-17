/// <reference types="vite/client" />/// <reference types="vite/client" />


// Add type definition for our custom window properties
interface invizionUI {
  toggleSettingsSidebar?: () => void;
}

declare global {
  interface Window {
    invizionUI?: invizionUI;
  }
}