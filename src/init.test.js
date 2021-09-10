import { render, screen } from '@testing-library/react';
import init from './init.jsx';

test('renders main elements on home page', () => {
  const virtualDom = init();
  render(virtualDom);
  const header = screen.getByText(/New 100 Stories/i);
  const updateButton = screen.getByRole('button');
  expect(header).toBeInTheDocument();
  expect(updateButton).toBeInTheDocument();
  expect(updateButton.innerHTML).toBe('Update stories');
  expect(updateButton).not.toBeDisabled();
});
