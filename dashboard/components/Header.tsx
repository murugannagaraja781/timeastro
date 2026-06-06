import { memo } from 'react';
import Link from 'next/link';

const Header = memo(function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 h-[70px] flex items-center justify-between px-8 bg-primaryYellow text-black z-50">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-full object-cover" />
        <span className="font-bold text-xl">MyAstroLabs</span>
      </div>
      <nav className="flex gap-6 text-base font-medium items-center">
        <Link href="/" className="hover:text-accentBlue transition-hover">Home</Link>
        <Link href="/about" className="hover:text-accentBlue transition-hover">About Us</Link>
        <Link href="/courses" className="hover:text-accentBlue transition-hover">Courses</Link>
        <Link href="/software" className="hover:text-accentBlue transition-hover">Software</Link>
        <Link href="#" className="hover:text-accentBlue transition-hover">Contact Us</Link>
        <Link href="/login" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition-colors ml-2">
          Application Login
        </Link>
      </nav>
    </header>
  );
});

export default Header;
