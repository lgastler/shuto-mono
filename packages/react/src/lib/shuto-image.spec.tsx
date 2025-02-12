import { render } from '@testing-library/react';
import ShutoImage from './shuto-image';
import ShutoProvider from './shuto-provider';

describe('ShutoImage', () => {
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

    const { baseElement } = render(
      <ShutoProvider config={mockConfig} signerConfig={mockSignerConfig}>
        <ShutoImage path="test.jpg" />
      </ShutoProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
