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

// 1. Tipe untuk Membaca Data (Hasil dari GET API & Prisma include)
// Digunakan pada Table, List, atau initialData di Form
export interface Tracking {
  id: string;
  deviceId: string;
  rssi: string | number; // Fleksibel jika dari backend dikonversi
  snr: string | number;
  latitude: number;
  longitude: number;
  deviceTime?: string;
  temperature?: number;
  pressure?: number;
  humidity?: number;
  heartRate?: number;
  spo2?: number;
  isEmergency: boolean;
  isFallen: boolean;
  hopCount?: number;
  routingPath?: number[];
  
  // Catatan: Jika API Anda langsung dari Prisma, biasanya menjadi createdAt (camelCase)
  // Pastikan sesuai dengan output JSON NextResponse Anda.
  createdAt?: string; 
  updatedAt?: string; 
  
  // Relasi
  device: {
    name: string;
    type: string;
  };
  climberUser?: {
    name: string;
    id: string;
  };
}

// 2. Tipe untuk Mengirim Data (Payload POST/PUT API)
// Digunakan sebagai parameter di fungsi addTracking()
export interface TTracking {
  deviceId: string;
  climberUserId: string;
  latitude: number;
  longitude: number;
  
  // Sesuai dengan snake_case yang diharapkan oleh route.ts Anda
  temperature?: number;
  pressure?: number;
  humidity?: number;
  heart_rate?: number;
  spo2?: number;
  
  gateway_rssi?: number;
  gateway_snr?: number;
  hop_count?: number;
  is_emergency: boolean;
  is_fallen: boolean;
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
