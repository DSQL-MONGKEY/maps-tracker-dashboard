import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type RouteParams = {
  params: {
    id: string
  };
}

export interface Tracking {
  id: string;
  device_id: string;
  rssi: string;
  snr:  string;
  latitude: number;
  longitude: number;
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
  devices: {
    name: string,
    type: string,
  }
  climber_users: {
    name: string
  }
} 

export interface Devices {
  created_at: string;
  updated_at: string;
  device_code: string;
  description: string;
  id: string;
  name: string;
  status: boolean;
  type: string;
}

export interface RegisterDevices {
  id: number;
  climber_user_id: string;
  device_id: string;
  registered_at: string;
  unregistered_at: string | null;
  is_active: boolean;
}

export interface ClimberUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}