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
      ? "text-accentBlue font-bold transition-hover" 
      : "hover:text-accentBlue transition-hover";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-[70px] flex items-center justify-between px-8 bg-primaryYellow text-black z-50 shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <img src={siteLogo} alt="logo" className="w-10 h-10 rounded-full object-cover" />
        <span className="font-bold text-xl">{siteTitle}</span>
      </Link>
      <nav className="flex gap-6 text-base font-medium items-center">
        <Link href="/" className={getLinkClass('/')}>Home</Link>
        <Link href="/about" className={getLinkClass('/about')}>About Us</Link>
        <Link href="/courses" className={getLinkClass('/courses')}>Courses</Link>
        <Link href="/software" className={getLinkClass('/software')}>Software</Link>
        <Link href="/contact" className={getLinkClass('/contact')}>Contact Us</Link>
        <Link href="/login" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition-colors ml-2">
          Application Login
        </Link>
      </nav>
    </header>
  );
});

export default Header;
