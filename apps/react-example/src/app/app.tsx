import { Route, Routes } from 'react-router-dom';
import { default as IndexPage } from './routes/index';
import { ShutoProvider } from '@shuto-img/react';

export function App() {
  return (
    <ShutoProvider
      config={{
        baseUrl: import.meta.env.VITE_SHUTO_API_URL,
        apiKey: import.meta.env.VITE_SHUTO_API_KEY,
      }}
    >
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/:collectionId" element={<IndexPage />} />
      </Routes>
    </ShutoProvider>
  );
}

export default App;
