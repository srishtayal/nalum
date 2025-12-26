import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Alumni Card Component
const MockAlumniCard = ({
  alumni
}: {
  alumni: {
    id: string;
    name: string;
    graduationYear: number;
    department: string;
    company?: string;
    position?: string;
    profilePicture?: string;
  };
}) => {
  return (
    <div data-testid={`alumni-${alumni.id}`}>
      {alumni.profilePicture && (
        <img 
          src={alumni.profilePicture} 
          alt={alumni.name}
          data-testid="alumni-picture"
        />
      )}
      <h3 data-testid="alumni-name">{alumni.name}</h3>
      <p data-testid="alumni-department">{alumni.department}</p>
      <p data-testid="alumni-year">Class of {alumni.graduationYear}</p>
      {alumni.company && (
        <p data-testid="alumni-company">{alumni.position} at {alumni.company}</p>
      )}
    </div>
  );
};

describe('Alumni Card Component', () => {
  const mockAlumni = {
    id: '1',
    name: 'John Doe',
    graduationYear: 2020,
    department: 'Computer Science',
    company: 'Tech Corp',
    position: 'Software Engineer',
    profilePicture: '/images/john.jpg'
  };

  it('should render alumni information', () => {
    render(<MockAlumniCard alumni={mockAlumni} />);

    expect(screen.getByTestId('alumni-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('alumni-department')).toHaveTextContent('Computer Science');
    expect(screen.getByTestId('alumni-year')).toHaveTextContent('Class of 2020');
  });

  it('should render company information when available', () => {
    render(<MockAlumniCard alumni={mockAlumni} />);

    expect(screen.getByTestId('alumni-company')).toHaveTextContent('Software Engineer at Tech Corp');
  });

  it('should not render company information when not available', () => {
    const alumniWithoutCompany = {
      ...mockAlumni,
      company: undefined,
      position: undefined
    };

    render(<MockAlumniCard alumni={alumniWithoutCompany} />);

    expect(screen.queryByTestId('alumni-company')).not.toBeInTheDocument();
  });

  it('should render profile picture when available', () => {
    render(<MockAlumniCard alumni={mockAlumni} />);

    const img = screen.getByTestId('alumni-picture') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('john.jpg');
    expect(img.alt).toBe('John Doe');
  });

  it('should not render profile picture when not available', () => {
    const alumniWithoutPicture = {
      ...mockAlumni,
      profilePicture: undefined
    };

    render(<MockAlumniCard alumni={alumniWithoutPicture} />);

    expect(screen.queryByTestId('alumni-picture')).not.toBeInTheDocument();
  });
});
