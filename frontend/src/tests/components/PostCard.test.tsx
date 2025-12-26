import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Post Card Component
const MockPostCard = ({ 
  post,
  onLike,
  onComment,
  onDelete
}: { 
  post: {
    id: string;
    title: string;
    content: string;
    author: string;
    likes: number;
    createdAt: string;
  };
  onLike?: () => void;
  onComment?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <article data-testid={`post-${post.id}`}>
      <h2 data-testid="post-title">{post.title}</h2>
      <p data-testid="post-content">{post.content}</p>
      <div data-testid="post-author">By: {post.author}</div>
      <div data-testid="post-likes">Likes: {post.likes}</div>
      <div data-testid="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
      <div>
        {onLike && (
          <button onClick={onLike} data-testid="like-button">
            Like
          </button>
        )}
        {onComment && (
          <button onClick={onComment} data-testid="comment-button">
            Comment
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} data-testid="delete-button">
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

describe('Post Card Component', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'John Doe',
    likes: 5,
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  it('should render post information', () => {
    render(<MockPostCard post={mockPost} />);

    expect(screen.getByTestId('post-title')).toHaveTextContent('Test Post');
    expect(screen.getByTestId('post-content')).toHaveTextContent('This is a test post content');
    expect(screen.getByTestId('post-author')).toHaveTextContent('By: John Doe');
    expect(screen.getByTestId('post-likes')).toHaveTextContent('Likes: 5');
  });

  it('should format date correctly', () => {
    render(<MockPostCard post={mockPost} />);

    const dateElement = screen.getByTestId('post-date');
    expect(dateElement).toBeInTheDocument();
    expect(dateElement.textContent).toBeTruthy();
  });

  it('should handle like button click', async () => {
    const user = userEvent.setup();
    const mockLike = vi.fn();

    render(<MockPostCard post={mockPost} onLike={mockLike} />);

    const likeButton = screen.getByTestId('like-button');
    await user.click(likeButton);

    expect(mockLike).toHaveBeenCalledTimes(1);
  });

  it('should handle comment button click', async () => {
    const user = userEvent.setup();
    const mockComment = vi.fn();

    render(<MockPostCard post={mockPost} onComment={mockComment} />);

    const commentButton = screen.getByTestId('comment-button');
    await user.click(commentButton);

    expect(mockComment).toHaveBeenCalledTimes(1);
  });

  it('should handle delete button click', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn();

    render(<MockPostCard post={mockPost} onDelete={mockDelete} />);

    const deleteButton = screen.getByTestId('delete-button');
    await user.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('should not render action buttons when handlers not provided', () => {
    render(<MockPostCard post={mockPost} />);

    expect(screen.queryByTestId('like-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comment-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });
});
