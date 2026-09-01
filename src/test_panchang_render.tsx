import React from 'react';
import { renderToString } from 'react-dom/server';
import { Panchang } from './pages/Panchang';

try {
  const html = renderToString(React.createElement(Panchang, { onBack: () => {} }));
  console.log('✅ Panchang SSR Render SUCCESS! HTML length:', html.length);
} catch (e) {
  console.error('❌ Panchang SSR Render FAILED:', e);
  process.exit(1);
}
