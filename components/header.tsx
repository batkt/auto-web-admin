'use client';

import { menuData } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaXmark } from 'react-icons/fa6';
import HeaderItems from './header-item';

const Header = ({
  data,
  lang,
  device,
}: {
  data: any;
  lang: string;
  device: 'desktop' | 'mobile';
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="relative md:h-20">
      <div className="absolute top-0 inset-x-0 h-16 md:h-20 z-10 transition-all duration-200">
        <HeaderItems
          className="text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          data={data}
          lang={lang}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          device={device}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={cn('fixed inset-0 bg-black/50 z-20', device === 'mobile' ? 'block' : 'hidden')}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out mobile-menu-container',
          device === 'mobile' ? 'block' : 'hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="uppercase font-black text-xl">Menu</div>
            <Button
              variant="ghost"
              size="icon"
              // onClick={() => setIsMobileMenuOpen(false)}
              className="text-foreground"
            >
              <FaXmark className="size-5" />
            </Button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              {data?.menuList?.map((menu, index) => (
                <li key={`menuIndex=${index}`}>
                  <Link
                    href={menu.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-lg font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    {menu.name?.[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              © 2025 Church Name. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
