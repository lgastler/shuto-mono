import { useContext } from 'react';
import { ShutoClient } from '@shuto/api';
import { ShutoContext } from './shuto-provider';

export function useShutoClient(): ShutoClient {
  const context = useContext(ShutoContext);
  if (!context) {
    throw new Error('useShutoClient must be used within a ShutoProvider');
  }
  return context.client;
}

export default useShutoClient;
