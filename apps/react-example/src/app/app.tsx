import { Route, Routes } from 'react-router-dom';
import { default as IndexPage } from './routes/index';
import { ShutoProvider } from '@shuto-img/react';

export function App() {
  return (
    <ShutoProvider
      config={{
        baseUrl: 'http://localhost:8080',
        apiKey: 'secret',
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
