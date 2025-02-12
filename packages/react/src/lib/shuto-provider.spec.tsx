import { render } from '@testing-library/react';

import ShutoProvider from './shuto-provider';

describe('ShutoProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShutoProvider />);
    expect(baseElement).toBeTruthy();
  });
});
