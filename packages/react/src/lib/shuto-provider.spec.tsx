import { render } from '@testing-library/react';

import ShutoProvider from './shuto-provider';

describe('ShutoProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ShutoProvider
        config={{ baseUrl: 'https://api.shuto.example.com' }}
        signerConfig={{ keys: [{ id: 'key1', secret: 'secret1' }] }}
      >
        <div>Test</div>
      </ShutoProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
