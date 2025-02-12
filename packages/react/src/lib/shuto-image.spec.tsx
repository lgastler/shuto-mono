import { render } from '@testing-library/react';

import ShutoImage from './shuto-image';

describe('ShutoImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ShutoImage />);
    expect(baseElement).toBeTruthy();
  });
});
