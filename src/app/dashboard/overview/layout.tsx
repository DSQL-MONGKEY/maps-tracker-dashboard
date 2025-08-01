import PageContainer from '@/components/layout/page-container';
import React from 'react';

interface IOverview {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  devices: React.ReactNode;
  climbers: React.ReactNode;
  register_device: React.ReactNode;
  trackings: React.ReactNode;
  maps: React.ReactNode;
}

export default function OverViewLayout({
  devices,
  climbers,
  register_device,
  trackings,
  maps
}: IOverview) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {climbers}
          {devices}
          {register_device}
          {trackings}
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'></div>
          <div className='col-span-4 md:col-span-3'>
          </div>
          <div className='col-span-4'></div>
          <div className='col-span-4 md:col-span-3'></div>
        </div>
      </div>
    </PageContainer>
  );
}
