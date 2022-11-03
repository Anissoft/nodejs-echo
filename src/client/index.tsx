import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { Header } from './blocks/Header/header.block';
import { RequestsList } from './blocks/RequestsList/requestsList.block';

import { useThemeChange } from './hooks/useTheme';
import { RequestsProvider } from './services/requests/requests.provider';

const root = createRoot(document.getElementById('main')!);

function MainLayout() {
  useThemeChange();

  useEffect(() => {
    document.documentElement.classList.remove('preload');
  }, []);

  return (
    <RequestsProvider>
      <Header/>
      <RequestsList />
    </RequestsProvider>
  );
}

root.render(React.createElement(MainLayout, { }));
