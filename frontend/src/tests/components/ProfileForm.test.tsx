import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Profile Form Component
const MockProfileForm = ({ 
  initialData, 
  onSubmit 
}: { 
  initialData?: { name: string; bio: string; company: string };
  onSubmit: (data: any) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      company: formData.get('company') as string,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="profile-form">
      <input
        type="text"
        name="name"
        placeholder="Name"
        defaultValue={initialData?.name}
        data-testid="name-input"
      />
      <textarea
        name="bio"
        placeholder="Bio"
        defaultValue={initialData?.bio}
        data-testid="bio-input"
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        defaultValue={initialData?.company}
        data-testid="company-input"
      />
      <button type="submit" data-testid="submit-button">
        Save Profile
      </button>
    </form>
  );
};

describe('Profile Form Component', () => {
  it('should render profile form fields', () => {
    const mockSubmit = vi.fn();
    render(<MockProfileForm onSubmit={mockSubmit} />);

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('bio-input')).toBeInTheDocument();
    expect(screen.getByTestId('company-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should populate form with initial data', () => {
    const mockSubmit = vi.fn();
    const initialData = {
      name: 'John Doe',
      bio: 'Software Engineer',
      company: 'Tech Corp'
    };
    
    render(<MockProfileForm initialData={initialData} onSubmit={mockSubmit} />);

    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    const bioInput = screen.getByTestId('bio-input') as HTMLTextAreaElement;
    const companyInput = screen.getByTestId('company-input') as HTMLInputElement;

    expect(nameInput.value).toBe('John Doe');
    expect(bioInput.value).toBe('Software Engineer');
    expect(companyInput.value).toBe('Tech Corp');
  });

  it('should handle form submission with updated data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    
    render(<MockProfileForm onSubmit={mockSubmit} />);

    const nameInput = screen.getByTestId('name-input');
    const bioInput = screen.getByTestId('bio-input');
    const submitButton = screen.getByTestId('submit-button');

    await user.type(nameInput, 'Jane Smith');
    await user.type(bioInput, 'Product Manager');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Jane Smith',
        bio: 'Product Manager',
        company: ''
      });
    });
  });

  it('should allow updating individual fields', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    const initialData = {
      name: 'John Doe',
      bio: 'Old bio',
      company: 'Old Company'
    };
    
    render(<MockProfileForm initialData={initialData} onSubmit={mockSubmit} />);

    const bioInput = screen.getByTestId('bio-input');
    await user.clear(bioInput);
    await user.type(bioInput, 'New bio');

    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          bio: 'New bio'
        })
      );
    });
  });
});
