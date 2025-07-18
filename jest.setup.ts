<!-- filepath: c:\Users\dioney\Documents\projeto\alt blog\BlogNews\jest.setup.ts -->
import '@testing-library/jest-dom';

// Mock do Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock do NextAuth
jest.mock('next-auth/react', () => ({
  useSession() {
    return { data: null, status: 'unauthenticated' };
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock do Material-UI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});