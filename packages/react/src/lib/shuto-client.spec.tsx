import * as React from 'react';
import { renderHook } from '@testing-library/react';

import useShutoClient from './shuto-client';
import ShutoProvider from './shuto-provider';

describe('useShutoClient', () => {
  it('should render successfully', () => {
    const mockConfig = {
      baseUrl: 'http://example.com',
    };

    const mockSignerConfig = {
      keys: [
        {
          id: 'test-key-id',
          secret: 'test-secret-key',
        },
      ],
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ShutoProvider config={mockConfig} signerConfig={mockSignerConfig}>
        {children}
      </ShutoProvider>
    );

    const { result } = renderHook(() => useShutoClient(), { wrapper });

    expect(result.current).toBeDefined();
  });
});
