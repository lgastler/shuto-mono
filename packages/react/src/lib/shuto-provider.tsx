import { ReactNode, createContext } from 'react';
import { ShutoClient, ShutoConfig, SignerConfig } from '@shuto-img/api';

interface ShutoContextValue {
  client: ShutoClient;
}

interface ShutoProviderProps {
  children: ReactNode;
  config: ShutoConfig;
  signerConfig: SignerConfig;
}

export const ShutoContext = createContext<ShutoContextValue | null>(null);

export function ShutoProvider({
  children,
  config,
  signerConfig,
}: ShutoProviderProps) {
  const client = new ShutoClient(config, signerConfig);

  return (
    <ShutoContext.Provider value={{ client }}>{children}</ShutoContext.Provider>
  );
}

export default ShutoProvider;
