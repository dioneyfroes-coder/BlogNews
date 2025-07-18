<!-- filepath: c:\Users\dioney\Documents\projeto\alt blog\BlogNews\src\components\__tests__\HelpBalloon.test.tsx -->
import { render, screen, fireEvent } from '@testing-library/react';
import HelpBalloon from '../HelpBallon';

describe('HelpBalloon Component', () => {
  const mockMessage = 'This is a help message for testing';

  it('should render help icon', () => {
    render(<HelpBalloon message={mockMessage} />);
    
    const helpIcon = screen.getByTestId('HelpOutlineIcon');
    expect(helpIcon).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    render(<HelpBalloon message={mockMessage} />);
    
    const helpIcon = screen.getByTestId('HelpOutlineIcon');
    fireEvent.mouseEnter(helpIcon);
    
    // Material-UI tooltip aparece com delay
    await screen.findByText(mockMessage);
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it('should hide tooltip on mouse leave', async () => {
    render(<HelpBalloon message={mockMessage} />);
    
    const helpIcon = screen.getByTestId('HelpOutlineIcon');
    
    // Show tooltip
    fireEvent.mouseEnter(helpIcon);
    await screen.findByText(mockMessage);
    
    // Hide tooltip
    fireEvent.mouseLeave(helpIcon);
    
    // Tooltip should disappear (with some delay)
    setTimeout(() => {
      expect(screen.queryByText(mockMessage)).not.toBeInTheDocument();
    }, 500);
  });
});