import { render, screen } from '@testing-library/react';
import App from './App';

// Basic test to check if the App component renders without crashing
test('renders learn react link', () => {
  // Render the App component
  render(<App />);
  // Look for an element containing "learn react" (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  // Assert that the element is present in the document
  expect(linkElement).toBeInTheDocument();
});
