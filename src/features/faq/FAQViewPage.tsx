import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, BatteryMedium, Activity, Mountain } from 'lucide-react';
import HowItWorksContent from './HowItWorksContent';
import AppPurposeContent from './AppPurposeContent';

type TFAQViewPageProps = {
  section: string;
};

// Komponen Visualisasi Animasi Sinyal LoRa
const LoRaSignalAnimation = () => {
  return (
    <div className='relative my-8 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50'>
      <div className='absolute z-10 flex flex-col items-center justify-center'>
        <div className='rounded-full border bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800'>
          <Radio className='h-8 w-8 text-blue-600 dark:text-blue-400' />
        </div>
        <span className='mt-3 text-sm font-medium text-slate-600 dark:text-slate-300'>
          Gateway
        </span>
      </div>

      {/* Ripple Animations */}
      <div className='absolute h-24 w-24 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-blue-500/30'></div>
      <div className='absolute h-48 w-48 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-blue-500/20 delay-300'></div>
      <div className='absolute h-72 w-72 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-2 border-blue-500/10 delay-700'></div>
    </div>
  );
};

export default async function FAQViewPage({ section }: TFAQViewPageProps) {
  let pageTitle = '';
  let content = null;

  if (section === 'lora') {
    pageTitle = 'Understanding LoRa Technology';
    content = (
      <div className='mx-auto max-w-4xl space-y-12'>
        {/* Header Section */}
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
            {pageTitle}
          </h1>
          <p className='mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400'>
            A comprehensive guide to Long Range radio technology, its core
            mechanics, and why it is the standard for modern Internet of Things
            (IoT) connectivity.
          </p>
        </div>

        {/* Visualizer */}
        <LoRaSignalAnimation />

        {/* Key Features Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80'>
            <CardHeader className='space-y-1'>
              <Activity className='mb-2 h-6 w-6 text-indigo-500' />
              <CardTitle className='text-lg'>Ultra-Long Range</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-slate-600 dark:text-slate-400'>
              Capable of transmitting data up to 15 kilometers in rural areas
              and dense natural environments, far surpassing traditional WiFi or
              Bluetooth.
            </CardContent>
          </Card>

          <Card className='border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80'>
            <CardHeader className='space-y-1'>
              <BatteryMedium className='mb-2 h-6 w-6 text-emerald-500' />
              <CardTitle className='text-lg'>Low Power Consumption</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-slate-600 dark:text-slate-400'>
              Designed for battery-operated devices. A single end-node can run
              for years on a small battery by efficiently managing its
              transmission cycles.
            </CardContent>
          </Card>

          <Card className='border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80'>
            <CardHeader className='space-y-1'>
              <Mountain className='mb-2 h-6 w-6 text-amber-500' />
              <CardTitle className='text-lg'>High Penetration</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-slate-600 dark:text-slate-400'>
              Utilizes sub-GHz frequencies (like 433MHz or 915MHz) that excel at
              piercing through physical obstacles such as thick foliage, rain,
              and concrete.
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Frequently Asked Questions
          </h2>
          <Accordion
            type='single'
            collapsible
            className='w-full rounded-xl border border-slate-200 bg-white px-6 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'
          >
            <AccordionItem value='item-1'>
              <AccordionTrigger className='text-left font-medium'>
                What exactly is LoRa?
              </AccordionTrigger>
              <AccordionContent className='leading-relaxed text-slate-600 dark:text-slate-400'>
                LoRa (Long Range) is a proprietary, low-power wide-area network
                modulation technique. It is based on spread spectrum modulation
                techniques derived from chirp spread spectrum (CSS) technology.
                In simple terms, it&apos;s a way of manipulating radio waves to
                encode data so that it can travel extremely far distances using
                very little power.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-2'>
              <AccordionTrigger className='text-left font-medium'>
                How is LoRa different from LoRaWAN?
              </AccordionTrigger>
              <AccordionContent className='leading-relaxed text-slate-600 dark:text-slate-400'>
                This is the most common confusion. <strong>LoRa</strong> is the
                physical layer—the actual radio chip (like the SX1278) and the
                radio waves themselves. <br />
                <br />
                <strong>LoRaWAN</strong> is the network protocol (the software
                layer) that sits on top of LoRa. It defines how devices
                communicate with gateways, how data is encrypted, and how the
                network handles thousands of devices simultaneously. You can use
                LoRa without LoRaWAN (point-to-point), but you cannot have
                LoRaWAN without LoRa.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-3'>
              <AccordionTrigger className='text-left font-medium'>
                Can I send images or voice notes over LoRa?
              </AccordionTrigger>
              <AccordionContent className='leading-relaxed text-slate-600 dark:text-slate-400'>
                Generally, no. The trade-off for LoRa&apos;s massive range and
                low power is its <strong>low bandwidth</strong>. Data rates
                typically range from 0.3 kbps to 50 kbps. It is perfectly
                designed for small data packets like GPS coordinates,
                temperature readings, and emergency flags (a few dozen bytes at
                a time), rather than megabytes of media files.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-4'>
              <AccordionTrigger className='text-left font-medium'>
                Why is it ideal for off-grid tracking?
              </AccordionTrigger>
              <AccordionContent className='leading-relaxed text-slate-600 dark:text-slate-400'>
                In environments lacking cellular coverage, LoRa creates its own
                independent network infrastructure. By establishing a central
                Gateway and deploying Extender nodes, you can blanket a vast
                area with connectivity. Its resilience to noise and interference
                ensures that critical telemetry—like an SOS signal or a
                fall-detection alert—reaches the base station reliably.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
  if (section === 'works') {
    pageTitle = 'How It Works';
    content = <HowItWorksContent />;
  }
  if (section === 'app') {
    pageTitle = 'What is this app for?';
    content = <AppPurposeContent />;
  }

  return (
    <div className='container px-4 py-16 md:py-24'>
      {content || (
        <div className='text-center text-slate-500'>Section not found.</div>
      )}
    </div>
  );
}
