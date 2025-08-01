import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['o', 'ov'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Climber Users',
    url: '/dashboard/climber-users',
    icon: 'climber',
    isActive: false,
    shortcut: ['cli', 'cli'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Devices',
    url: '/dashboard/devices',
    icon: 'devices',
    shortcut: ['de', 'de'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Register Device',
    url: '/dashboard/register-device',
    icon: 'register',
    shortcut: ['reg', 'reg'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Trackings',
    url: '/dashboard/trackings',
    icon: 'tracker',
    shortcut: ['t', 't'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Maps',
    url: '/dashboard/maps',
    icon: 'maps',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'FAQ',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'faq',
    isActive: true,

    items: [
      {
        title: 'What is LoRa System?',
        url: '/dashboard/faq/lora',
        icon: 'lora',
        shortcut: ['wl', 'wl']
      },
      {
        title: 'How it works?',
        shortcut: ['ha', 'ha'],
        url: '/dashboard/faq/works',
        icon: 'infra' 
      },
      {
        title: 'What is this app for?',
        shortcut: ['ap', 'ap'],
        url: '/dashboard/faq/app',
        icon: 'infra' 
      },
      {
        title: 'How to use this app?',
        shortcut: ['us', 'us'],
        url: '/dashboard/faq/use',
        icon: 'infra' 
      },
    ]
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: false,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
