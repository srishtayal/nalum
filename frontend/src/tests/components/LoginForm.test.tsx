import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Mock Login Component
const MockLoginForm = ({ onSubmit }: { onSubmit: (email: string, password: string) => void }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        data-testid="email-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        data-testid="password-input"
      />
      <button type="submit" data-testid="submit-button">
        Login
      </button>
    </form>
  );
};

describe('Login Form Component', () => {
  it('should render login form', () => {
    const mockSubmit = vi.fn();
    render(<MockLoginForm onSubmit={mockSubmit} />);

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<MockLoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should require email field', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<MockLoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    expect(emailInput.required).toBe(true);
  });

  it('should require password field', async () => {
    const mockSubmit = vi.fn();
    
    render(<MockLoginForm onSubmit={mockSubmit} />);

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    expect(passwordInput.required).toBe(true);
  });

  it('should have correct input types', () => {
    const mockSubmit = vi.fn();
    
    render(<MockLoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
  });
});
