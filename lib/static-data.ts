import {
  Newspaper,
  SquareTerminal,
  Users,
  LayoutDashboardIcon,
  Mail,
  BarChart3,
} from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  breadcrumb?: string[];
  items?: {
    title: string;
    url: string;
    breadcrumb?: string[];
  }[];
}

export const MENU_DATA: MenuItem[] = [
  {
    title: 'Хянах самбар',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Контент',
    url: '/content',
    icon: SquareTerminal,
    items: [
      {
        title: 'Хуудас засах',
        url: '/content/pages',
        breadcrumb: ['Контент', 'Хуудас'],
      },
    ],
  },
  {
    title: 'Мэдээ',
    url: '/blogs',
    icon: Newspaper,
    items: [
      {
        title: 'Мэдээ үүсгэх',
        url: '/blogs/create',
        breadcrumb: ['Мэдээ', 'Шинэ мэдээ'],
      },
      {
        title: 'Жагсаалт',
        url: '/blogs/list',
        breadcrumb: ['Мэдээ', 'Жагсаалт'],
      },
      {
        title: 'Категориуд',
        url: '/blogs/categories',
        breadcrumb: ['Мэдээ', 'Категориуд'],
      },
    ],
  },
  {
    title: 'Мессеж',
    url: '/messages',
    icon: Mail,
    items: [
      {
        title: 'Жагсаалт',
        url: '/messages',
        breadcrumb: ['Мессеж', 'Жагсаалт'],
      },
    ],
  },
  {
    title: 'Судалгаа',
    url: '/survey',
    icon: BarChart3,
    items: [
      {
        title: 'Шинэ судалгаа',
        url: '/survey/create',
        breadcrumb: ['Судалгаа', 'Шинэ судалгаа'],
      },
      {
        title: 'Жагсаалт',
        url: '/survey/list',
        breadcrumb: ['Судалгаа', 'Жагсаалт'],
      },
    ],
  },
  {
    title: 'Ажилчид',
    url: '/users',
    icon: Users,
    items: [
      {
        title: 'Жагсаалт',
        url: '/users',
        breadcrumb: ['Ажилчид', 'Жагсаалт'],
      },
    ],
  },
  // {
  //   title: 'Settings',
  //   url: '#',
  //   icon: Settings2,
  //   items: [
  //     {
  //       title: 'General',
  //       url: '#',
  //     },
  //     {
  //       title: 'Team',
  //       url: '#',
  //     },
  //     {
  //       title: 'Billing',
  //       url: '#',
  //     },
  //     {
  //       title: 'Limits',
  //       url: '#',
  //     },
  //   ],
  // },
];

export const menuData = [
  {
    path: '/',
    name: 'Home',
  },
  {
    path: '/about',
    name: 'About',
  },
  {
    path: '/branches',
    name: 'Branches',
  },
  {
    path: '/donate',
    name: 'Donate',
  },
  {
    path: '/blog',
    name: 'Blog',
  },
  {
    path: '/contact',
    name: 'Contact',
  },
];
