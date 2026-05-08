import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  ArrowDown,
  AudioWaveform,
  Cpu,
  Database,
  Radio,
  Signal
} from 'lucide-react';

export default function HowItWorksContent() {
  return (
    <div className='animate-in fade-in mx-auto max-w-5xl space-y-16 duration-700'>
      {/* HEADER SECTION */}
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Bagaimana Sistem Ini Bekerja?
        </h1>
        <p className='mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400'>
          Dari denyut nadi di atas gunung hingga tampil di layar pemantauan.
          Pelajari bagaimana gelombang radio dan arsitektur multi-hop memastikan
          tidak ada sinyal yang tertinggal.
        </p>
      </div>

      {/* THEORY SECTION: CHIRP SPREAD SPECTRUM */}
      <section className='space-y-6'>
        <div className='flex items-center gap-3'>
          <AudioWaveform className='h-8 w-8 text-blue-500' />
          <h2 className='text-2xl font-semibold tracking-tight'>
            Rahasia LoRa: Chirp Spread Spectrum (CSS)
          </h2>
        </div>
        <Card className='overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50'>
          <CardContent className='p-0 sm:flex'>
            <div className='flex flex-col justify-center space-y-4 p-6 sm:w-1/2'>
              <p className='leading-relaxed text-slate-600 dark:text-slate-400'>
                Berbeda dengan WiFi atau Bluetooth yang menggunakan frekuensi
                statis, LoRa menggunakan <strong>Chirps</strong> (kicauan).
                Sinyal ini menyapu pita frekuensi dari bawah ke atas (Up-Chirp)
                atau atas ke bawah (Down-Chirp) secara konstan.
              </p>
              <p className='leading-relaxed text-slate-600 dark:text-slate-400'>
                Karena sinyal ini bergerak melintasi spektrum, ia menjadi kebal
                terhadap <em>noise</em> (gangguan) di satu frekuensi tertentu.
                Ini memungkinkan penerima (Gateway) mendengarkan sinyal meskipun
                kekuatan sinyal tersebut berada di bawah tingkat kebisingan
                latar belakang (SNR negatif). Inilah yang membuatnya mampu
                menembus hambatan alam ekstrem.
              </p>
            </div>
            {/* Visualisasi CSS Sederhana */}
            <div className='relative flex min-h-[250px] flex-col items-center justify-center bg-slate-900 p-6 sm:w-1/2'>
              <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_24px]'></div>
              <div className='relative z-10 flex h-32 w-full items-end justify-around opacity-80'>
                {/* Up-Chirps Animation */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className='w-2 rounded-t-full bg-blue-500'
                    style={{
                      height: `${(i + 1) * 15}%`,
                      animation: `pulse 1.5s infinite ${i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
              <p className='z-10 mt-4 font-mono text-sm text-blue-400'>
                Up-Chirp Frequency Sweep
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TOPOLOGY & DATA FLOW TIMELINE */}
      <section className='relative space-y-8'>
        <div className='mb-8 flex items-center gap-3'>
          <Signal className='h-8 w-8 text-emerald-500' />
          <h2 className='text-2xl font-semibold tracking-tight'>
            Alur Komunikasi Multi-Hop
          </h2>
        </div>

        {/* Garis vertikal penghubung */}
        <div className='absolute top-24 bottom-0 left-[27px] hidden w-0.5 -translate-x-1/2 bg-slate-200 md:left-1/2 md:block dark:bg-zinc-800'></div>

        {/* Step 1: End-Device */}
        <div className='group relative flex flex-col items-center gap-8 md:flex-row'>
          <div className='flex justify-end text-right md:w-1/2 md:pr-12'>
            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                1. End-Device (Pemancar)
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Alat yang dikenakan merekam data vital (Suhu, Tekanan, Detak
                Jantung, SpO2) dan koordinat GPS. Data dimampatkan menjadi paket
                biner kecil berukuran <strong>25-byte</strong>, lalu dipancarkan
                ke udara melalui frekuensi 433MHz. Jika tombol darurat ditekan
                atau alat mendeteksi benturan, transmisi dilakukan seketika
                (Bypass).
              </p>
            </div>
          </div>
          <div className='absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-emerald-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900'>
            <Activity className='h-6 w-6 text-emerald-500' />
          </div>
          <div className='opacity-0 md:w-1/2 md:pl-12 md:opacity-100'></div>
        </div>

        {/* Arrow Connector Mobile */}
        <div className='my-4 flex justify-center md:hidden'>
          <ArrowDown className='text-slate-300' />
        </div>

        {/* Step 2: Extender Node */}
        <div className='group relative flex flex-col items-center gap-8 md:flex-row'>
          <div className='opacity-0 md:w-1/2 md:pr-12 md:opacity-100'></div>
          <div className='absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-amber-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900'>
            <Radio className='h-6 w-6 text-amber-500' />
          </div>
          <div className='flex justify-start text-left md:w-1/2 md:pl-12'>
            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                2. Extender Node (Repeater)
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Dipasang di titik-titik tinggi untuk memperluas jangkauan.
                Extender menangkap sinyal 25-byte tersebut, memvalidasi agar
                tidak terjadi pengulangan (Anti-Looping), menambahkan ID rutenya
                sendiri ke dalam paket, menyimpannya di antrean (Circular
                Buffer), dan memancarkannya kembali ke arah Base Station.
              </p>
            </div>
          </div>
        </div>

        {/* Arrow Connector Mobile */}
        <div className='my-4 flex justify-center md:hidden'>
          <ArrowDown className='text-slate-300' />
        </div>

        {/* Step 3: Gateway */}
        <div className='group relative flex flex-col items-center gap-8 md:flex-row'>
          <div className='flex justify-end text-right md:w-1/2 md:pr-12'>
            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                3. Gateway (Base Station)
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Penerima akhir di posko keselamatan. Gateway menerjemahkan
                struktur biner radio, membaca kualitas kekuatan sinyal (RSSI)
                dan tingkat kebisingan (SNR). Jika terdeteksi bendera (flag)
                darurat, alarm lokal akan berbunyi. Gateway kemudian membungkus
                data tersebut ke dalam format JSON.
              </p>
            </div>
          </div>
          <div className='absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-blue-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900'>
            <Cpu className='h-6 w-6 text-blue-500' />
          </div>
          <div className='opacity-0 md:w-1/2 md:pl-12 md:opacity-100'></div>
        </div>

        {/* Arrow Connector Mobile */}
        <div className='my-4 flex justify-center md:hidden'>
          <ArrowDown className='text-slate-300' />
        </div>

        {/* Step 4: Backend & Dashboard */}
        <div className='group relative flex flex-col items-center gap-8 md:flex-row'>
          <div className='opacity-0 md:w-1/2 md:pr-12 md:opacity-100'></div>
          <div className='absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-purple-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900'>
            <Database className='h-6 w-6 text-purple-500' />
          </div>
          <div className='flex justify-start text-left md:w-1/2 md:pl-12'>
            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                4. Cloud Backend & UI
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Gateway mengirimkan JSON melalui HTTP POST ke API rute tunggal.
                Data divalidasi dan disimpan ke dalam database PostgreSQL. Detik
                itu juga, status pendaki, rute lompatan perangkat (routing
                path), dan kondisi lingkungan otomatis diperbarui pada layar
                monitor pemantauan secara real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
