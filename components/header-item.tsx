'use client';

import { menuData } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';
import { FaBars } from 'react-icons/fa6';
import Image from 'next/image';
import { getImageUrl } from '@/utils';

interface HeaderItemsProps {
  className?: string;
  data: {
    menuList: any[];
    logoImage: string;
  };
  lang: string;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  device: 'desktop' | 'mobile';
}

const HeaderItems = ({
  className,
  data,
  lang,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  device,
}: HeaderItemsProps) => {
  return (
    <div
      className={cn(
        'h-full flex justify-between items-center container max-w-6xl px-6 mx-auto',
        className
      )}
    >
      <div className="uppercase font-black text-2xl">
        <Image
          src={getImageUrl(data?.logoImage || '')}
          alt="logo"
          width={100}
          height={100}
          className="h-10 w-auto"
        />
      </div>

      {/* Desktop Navigation */}
      <ul className={cn('items-center gap-8', device === 'mobile' ? 'hidden' : 'flex')}>
        {data.menuList?.map((menu, index) => {
          return (
            <li key={`menuIndex=${index}`}>
              <Link
                href={menu.path}
                className="py-4 hover:text-[#0888A3] font-semibold text-sm transition-colors"
              >
                {menu.name?.[lang]}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        // onClick={() => setIsMobileMenuOpen?.(!isMobileMenuOpen)}
        className={cn('text-inherit hover:bg-white/10', device === 'mobile' ? 'block' : 'hidden')}
      >
        <FaBars className="size-5" />
      </Button>
    </div>
  );
};

export default HeaderItems;
