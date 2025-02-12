import { Route, Routes } from 'react-router-dom';
import { default as IndexPage } from './routes/index';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
