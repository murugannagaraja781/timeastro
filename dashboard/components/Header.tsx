import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = memo(function Header() {
  const [siteTitle, setSiteTitle] = useState('MyAstroLabs');
  const [siteLogo, setSiteLogo] = useState('/logo.png');
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost/timeastro/api/public/settings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          if (data.data.site_title) setSiteTitle(data.data.site_title);
          if (data.data.site_logo) setSiteLogo(data.data.site_logo);
        }
      })
      .catch(console.error);
  }, []);

  const getLinkClass = (path: string) => {
    return router.pathname === path 
      ? "text-gold font-bold transition-hover" 
      : "text-gray-300 hover:text-pureWhite transition-hover";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-[70px] flex items-center justify-between px-4 md:px-8 bg-darkNavy z-50 border-b border-[rgba(212,175,55,0.2)] premium-shadow">
      <Link href="/" className="flex items-center gap-3 group">
        <img src={siteLogo} alt="logo" className="w-10 h-10 rounded-full object-cover border border-gold" />
        <span className="font-bold text-xl text-gold group-hover:text-pureWhite transition-hover uppercase tracking-widest">{siteTitle}</span>
      </Link>
      <nav className="hidden md:flex gap-6 text-[15px] items-center">
        <Link href="/" className={getLinkClass('/')}>Home</Link>
        <Link href="/about" className={getLinkClass('/about')}>About</Link>
        <Link href="/courses" className={getLinkClass('/courses')}>Courses</Link>
        <Link href="/software" className={getLinkClass('/software')}>Software</Link>
        <Link href="/contact" className={getLinkClass('/contact')}>Contact</Link>
        <Link href="/login" className="bg-gold hover:bg-yellow-500 text-darkNavy font-bold px-5 py-2 rounded-full transition-all duration-300 ml-4 shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          Login
        </Link>
      </nav>
    </header>
  );
});

export default Header;
