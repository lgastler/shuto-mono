import { createContext, useContext, useMemo } from 'react';
import { ShutoClient, ShutoConfig, SignerConfig } from '@shuto-img/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ShutoContextValue {
  client: ShutoClient;
  queryClient: QueryClient;
}

interface ShutoProviderProps {
  config: ShutoConfig;
  signerConfig?: SignerConfig;
  children: React.ReactNode;
}

const ShutoContext = createContext<ShutoContextValue | null>(null);

export function ShutoProvider({
  config,
  signerConfig,
  children,
}: ShutoProviderProps) {
  const client = useMemo(
    () => new ShutoClient(config, signerConfig),
    [config, signerConfig]
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ShutoContext.Provider value={{ client, queryClient }}>
        {children}
      </ShutoContext.Provider>
    </QueryClientProvider>
  );
}

export function useShutoClient() {
  const context = useContext(ShutoContext);
  if (!context) {
    throw new Error('useShutoClient must be used within a ShutoProvider');
  }
  return context.client;
}

export function useShutoQueryClient() {
  const context = useContext(ShutoContext);
  if (!context) {
    throw new Error('useShutoQueryClient must be used within a ShutoProvider');
  }
  return context.queryClient;
}
