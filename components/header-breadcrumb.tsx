'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { MENU_DATA } from '@/lib/static-data';

const HeaderBreadcrumb = () => {
  const pathname = usePathname();

  // Function to get breadcrumb data based on current path
  const getBreadcrumbData = () => {
    // Find the menu item that matches the current path
    for (const menuItem of MENU_DATA) {
      // Check main menu item
      if (menuItem.url === pathname) {
        return menuItem.breadcrumb || [menuItem.title];
      }

      // Check sub-menu items
      if (menuItem.items) {
        for (const subItem of menuItem.items) {
          if (subItem.url === pathname) {
            return subItem.breadcrumb || [menuItem.title, subItem.title];
          }
        }
      }
    }

    // Fallback: generate breadcrumb from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];

    const breadcrumb: string[] = [];

    // Map path segments to readable names
    const segmentMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'pages': 'Хуудас',
      'content': 'Контент',
      'articles': 'Мэдээ',
      'images': 'Зураг',
      'videos': 'Видео',
      'files': 'Файлууд',
      'users': 'Ажилчид',
      'create': 'Шинэ',
    };

    pathSegments.forEach(segment => {
      const readableName = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumb.push(readableName);
    });

    return breadcrumb;
  };

  const breadcrumbItems = getBreadcrumbData();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item: string, index: number) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href="#">{item}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeaderBreadcrumb;
