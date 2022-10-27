import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('main')!);

root.render(React.createElement(function MainLayout() {
  return null;
}, {}));