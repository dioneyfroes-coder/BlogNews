<!-- filepath: c:\Users\dioney\Documents\projeto\alt blog\BlogNews\src\components\__tests__\Footer.test.tsx -->
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('should render footer with correct text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Blog/)).toBeInTheDocument();
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument();
    expect(screen.getByText(/CC BY-NC/)).toBeInTheDocument();
  });

  it('should have correct styling and structure', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    const container = footer.querySelector('.MuiContainer-root');
    expect(container).toBeInTheDocument();
  });
});