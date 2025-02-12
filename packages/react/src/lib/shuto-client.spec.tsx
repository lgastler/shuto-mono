import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useShutoClient from './shuto-client';

describe('useShutoClient', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useShutoClient());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
