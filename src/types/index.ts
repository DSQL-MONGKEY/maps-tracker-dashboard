import { Icons } from '@/components/icons';
import { DeviceType } from '@prisma/client';

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
    id: string;
  };
};

export interface Tracking {
  id: string;
  deviceId: string;
  rssi: string;
  snr: string;
  latitude: number;
  longitude: number;
  deviceTime: string;
  temperature: number;
  pressure: number;
  humidity: number;
  heartRate: number;
  spo2: number;
  isEmergency: boolean;
  isFallen: boolean;
  hopCount: number;
  routingPath: number[];
  created_at: string;
  updated_at: string;
  device: {
    name: string;
    type: string;
  };
  climberUser: {
    name: string;
  };
}

export interface Devices {
  id: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  deviceCode: string | null;
  description: string | null;
  status: boolean | null;
  type: DeviceType | null;
}

export interface RegisterDevices {
  id: string;
  climber_user_id: string;
  device_id: string;
  registered_at: string | null;
  unregistered_at: string | null;
  updated_at: string;
  is_active: boolean;
  devices: {
    name: string;
    type: string;
  };
  climber_users: {
    name: string;
  };
}

export interface ClimberUser {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string | Date;
  updated_at: string | Date | null;
}
