import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  Cpu,
  Link2,
  Navigation,
  Map as MapIcon,
  KanbanSquare
} from 'lucide-react';

export default function AppPurposeContent() {
  return (
    <div className='animate-in fade-in mx-auto max-w-5xl space-y-16 duration-700'>
      {/* HEADER SECTION */}
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
          What is this app for?
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400'>
          This application serves as the <strong>Central Command Center</strong>{' '}
          for base camp operators. It translates raw radio signals from the
          mountains into an easy-to-read, real-time dashboard to ensure climber
          safety and streamline rescue operations.
        </p>
      </div>

      {/* FEATURES GRID BASED ON SIDEBAR */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Overview */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
              <LayoutDashboard className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <CardTitle className='text-xl'>Overview</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            Get a bird&apos;s-eye view of the entire operation. This dashboard
            highlights active climbers, overall system health, and immediate
            emergency alerts at a single glance.
          </CardContent>
        </Card>

        {/* Climber Users */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30'>
              <Users className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <CardTitle className='text-xl'>Climber Users</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            Manage the database of hikers. This includes storing their personal
            profiles, emergency contacts, and vital medical information before
            they start their journey.
          </CardContent>
        </Card>

        {/* Devices */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800'>
              <Cpu className='h-5 w-5 text-slate-700 dark:text-slate-300' />
            </div>
            <CardTitle className='text-xl'>Devices</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            The hardware inventory manager. Monitor the status, battery life,
            and types of all registered hardware, including End-Devices,
            Extenders, and Gateways.
          </CardContent>
        </Card>

        {/* Register Device */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30'>
              <Link2 className='h-5 w-5 text-amber-600 dark:text-amber-400' />
            </div>
            <CardTitle className='text-xl'>Register Device</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            The pairing module. Before a hike, use this feature to securely link
            a specific hardware device to a specific climber to track their
            active session.
          </CardContent>
        </Card>

        {/* Trackings */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
              <Navigation className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            </div>
            <CardTitle className='text-xl'>Trackings</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            The raw data log. View a detailed, tabular history of all incoming
            telemetry, including Heart Rate, SpO2, environmental data, and
            network routing hops.
          </CardContent>
        </Card>

        {/* Maps */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30'>
              <MapIcon className='h-5 w-5 text-teal-600 dark:text-teal-400' />
            </div>
            <CardTitle className='text-xl'>Maps</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            Geographical visualization. Track climbers visually on a map,
            monitor their exact GPS coordinates, trace their movement history,
            and pinpoint SOS locations.
          </CardContent>
        </Card>

        {/* Kanban */}
        <Card className='border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:col-span-2 lg:col-span-3 dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardHeader className='space-y-1 pb-4'>
            <div className='mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30'>
              <KanbanSquare className='h-5 w-5 text-rose-600 dark:text-rose-400' />
            </div>
            <CardTitle className='text-xl'>Kanban</CardTitle>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
            Task and incident management. Organize rescue missions, coordinate
            team responses, or schedule device maintenance using an intuitive
            drag-and-drop board system.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
