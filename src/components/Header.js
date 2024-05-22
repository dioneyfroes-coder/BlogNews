import Link from 'next/link';

const Header = () => {
  return (
    <header style={{ padding: '20px', background: '#333', color: '#fff' }}>
      <nav>
        <Link legacyBehavior href="/">
          <a style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Home</a>
        </Link>
        <Link legacyBehavior href="/about">
          <a style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>About</a>
        </Link>
        <Link legacyBehavior href="/contact">
          <a style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Contact</a>
        </Link>
        <Link legacyBehavior href="/admin">
          <a style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Admin</a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
