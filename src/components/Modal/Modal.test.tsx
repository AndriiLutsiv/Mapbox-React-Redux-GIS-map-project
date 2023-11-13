import { render, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

jest.mock('body-scroll-lock', () => ({
  disableBodyScroll: jest.fn(),
  enableBodyScroll: jest.fn(),
  clearAllBodyScrollLocks: jest.fn(),
}));

describe('Modal Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const handleClose = jest.fn();
    const { getByText } = render(
      <Modal onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const modalContent = getByText('Modal Content');
    expect(modalContent).toBeInTheDocument();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const handleClose = jest.fn();

    const { getByTestId } = render(
      <Modal onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>
    );

    const backdrop = getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('disables body scroll when the modal is open', () => {
    const handleClose = jest.fn();
    render(
      <Modal onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(disableBodyScroll).toHaveBeenCalledTimes(1);
  });

  it('calls the cleanup function when the modal is unmounted', async () => {
    const handleClose = jest.fn();
    const { unmount } = render(
      <Modal onClose={handleClose}>
        <p>Modal Content</p>
      </Modal>
    );
  
    await new Promise(r => setTimeout(r, 100));
    
    unmount();
    
    await new Promise(r => setTimeout(r, 100));
    
    expect(clearAllBodyScrollLocks).toHaveBeenCalledTimes(1);
  });
});
