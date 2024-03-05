import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('should say Hello World!', async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Hello World!/i)).toBeDefined(),
    );
  });
});
