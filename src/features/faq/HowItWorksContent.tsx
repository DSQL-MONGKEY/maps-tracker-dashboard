"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Activity,
  ArrowDown,
  AudioWaveform,
  Cpu,
  Database,
  Gauge,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Signal
} from 'lucide-react';

interface MovingPacketProps {
  path: string;
  begin: string;
  dur: number;
  color: string;
  size?: number;
  ring?: boolean;
}

interface ArrivalPingProps {
  x: number;
  y: number;
  color: string;
  begin: string;
  dur?: number;
}

/* ------------------------------------------------------------------ */
/* KONFIGURASI DIAGRAM SIMULASI JANGKAUAN                              */
/* ------------------------------------------------------------------ */
// R_PX merepresentasikan radius 5 km. Jarak antar node sengaja dibuat
// PERSIS sama dengan R_PX, sehingga tiap node duduk tepat di ujung
// lingkaran radius tetangganya -- kondisi jangkauan maksimum yang
// saling meng-cover di ujung-ujung radius.
const R_PX = 190;
const R_KM = 5;

const DEVICES = [
  {
    id: 'end',
    name: 'End-Device',
    role: 'Alat pemancar di tubuh pendaki',
    note: 'Memancarkan detak jantung, SpO2, tekanan, dan koordinat GPS setiap beberapa detik. Tombol darurat memicu transmisi seketika.',
    icon: Activity,
    color: '#10b981',
    x: 170,
    y: 430,
    labelAnchor: 'start',
    radiusDir: { dx: -0.72, dy: 0.7 }
  },
  {
    id: 'ext',
    name: 'Extender Node',
    role: 'Repeater di titik tertinggi',
    note: 'Menangkap paket, mencegah looping, menambahkan ID rute, lalu memancarkannya kembali menuju gateway.',
    icon: Radio,
    color: '#f59e0b',
    x: 287,
    y: 280,
    labelAnchor: 'middle',
    radiusDir: { dx: 0, dy: -1 }
  },
  {
    id: 'gw',
    name: 'Gateway',
    role: 'Base station di posko keselamatan',
    note: 'Membaca RSSI & SNR, membunyikan alarm bila ada flag darurat, lalu membungkus data ke JSON untuk backend.',
    icon: Cpu,
    color: '#3b82f6',
    x: 404,
    y: 430,
    labelAnchor: 'end',
    radiusDir: { dx: 0.72, dy: 0.7 }
  }
];

const CYCLE = 8; // detik, total durasi satu siklus animasi (di-loop lewat elemen "clock")

/* Node kecil pembantu: paket data / ACK yang bergerak sepanjang path */
function MovingPacket({ path, begin, dur, color, size = 6, ring = false }: MovingPacketProps) {
  return (
    <circle r={size} fill={ring ? '#f8fafc' : color} stroke={ring ? color : 'none'} strokeWidth={ring ? 2 : 0} opacity="0">
      <animateMotion path={path} dur={`${dur}s`} begin={begin} fill="freeze" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.85;1" dur={`${dur}s`} begin={begin} fill="freeze" />
    </circle>
  );
}

/* Efek "ping" saat paket tiba di sebuah node */
function ArrivalPing({ x, y, color, begin, dur = 0.9 }: ArrivalPingProps) {
  return (
    <circle cx={x} cy={y} r="8" fill="none" stroke={color} strokeWidth="2" opacity="0">
      <animate attributeName="r" values="8;40" dur={`${dur}s`} begin={begin} fill="freeze" />
      <animate attributeName="opacity" values="0.85;0" dur={`${dur}s`} begin={begin} fill="freeze" />
    </circle>
  );
}

function CoverageSimulation() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState({ rssi: -92, snr: -4.2 });
  const [reducedMotionNotice, setReducedMotionNotice] = useState(false);
  // runId sengaja dijadikan React "key" pada <svg> di bawah: mengubahnya
  // memaksa seluruh timeline SMIL dibuat ulang dari nol (t=0s), jadi cara
  // paling andal untuk mengulang simulasi tanpa trik sinkronisasi manual.
  const [runId, setRunId] = useState(0);

  const handleReplay = () => {
    setRunId((n) => n + 1);
    setIsPlaying(true);
  };

  // Hormati preferensi reduced-motion perangkat saat pertama kali dimuat.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) {
      setIsPlaying(false);
      setReducedMotionNotice(true);
    }
  }, []);

  // Jeda / lanjutkan seluruh timeline SMIL lewat native SVG animation API.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      if (isPlaying) svg.unpauseAnimations?.();
      else svg.pauseAnimations?.();
    } catch (e) {
      /* SMIL tidak didukung: diagram tetap statis, tidak fatal */
    }
  }, [isPlaying]);

  // Pembacaan RSSI/SNR simulatif di Gateway, hanya untuk ilustrasi.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setTelemetry({
        rssi: -(70 + Math.floor(Math.random() * 40)),
        snr: Number((Math.random() * 22 - 15).toFixed(1))
      });
    }, CYCLE * 1000 * 0.5);
    return () => clearInterval(id);
  }, [isPlaying]);

  const pathEndExt = `M${DEVICES[0].x},${DEVICES[0].y} L${DEVICES[1].x},${DEVICES[1].y}`;
  const pathExtEnd = `M${DEVICES[1].x},${DEVICES[1].y} L${DEVICES[0].x},${DEVICES[0].y}`;
  const pathExtGw = `M${DEVICES[1].x},${DEVICES[1].y} L${DEVICES[2].x},${DEVICES[2].y}`;
  const pathGwExt = `M${DEVICES[2].x},${DEVICES[2].y} L${DEVICES[1].x},${DEVICES[1].y}`;

  const activeDevice = DEVICES.find((d) => d.id === selected);

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardContent className="p-0">
        <div className="relative bg-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_24px]" />

          <svg
            key={runId}
            ref={svgRef}
            viewBox="-40 55 660 585"
            className="relative z-10 aspect-[44/39] w-full"
            role="img"
            aria-label="Simulasi tiga perangkat LoRa (end-device, extender, gateway) dengan radius jangkauan 5 km yang saling tumpang tindih di ujung-ujung radius, disertai animasi pengiriman paket dan balasan ACK."
          >
            {/* Elemen jam tak-terlihat: menjadi acuan waktu untuk semua animasi lain agar siklusnya sinkron dan berulang */}
            <rect x="0" y="0" width="1" height="1" opacity="0">
              <animate id="clock" attributeName="opacity" values="0;0" dur={`${CYCLE}s`} begin="0s" repeatCount="indefinite" />
            </rect>

            <defs>
              {DEVICES.map((d) => (
                <radialGradient key={d.id} id={`grad-${d.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={d.color} stopOpacity="0.28" />
                  <stop offset="75%" stopColor={d.color} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={d.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {/* Siluet punggung gunung, murni dekoratif */}
            <path
              d="M-40,470 L60,380 L150,440 L287,290 L360,420 L470,360 L560,430 L620,400 L620,640 L-40,640 Z"
              fill="#1e293b"
              opacity="0.6"
            />

            {/* Lingkaran radius 5 km per perangkat */}
            {DEVICES.map((d) => {
              const isDim = selected && selected !== d.id;
              return (
                <circle
                  key={d.id}
                  cx={d.x}
                  cy={d.y}
                  r={R_PX}
                  fill={`url(#grad-${d.id})`}
                  stroke={d.color}
                  strokeOpacity={isDim ? 0.15 : 0.55}
                  strokeWidth={selected === d.id ? 2.5 : 1.2}
                  strokeDasharray="6 5"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Garis penanda skala "5 km" per perangkat */}
            {DEVICES.map((d) => {
              const ex = d.x + d.radiusDir.dx * R_PX;
              const ey = d.y + d.radiusDir.dy * R_PX;
              return (
                <g key={`scale-${d.id}`} opacity={selected && selected !== d.id ? 0.2 : 0.8}>
                  <line x1={d.x} y1={d.y} x2={ex} y2={ey} stroke={d.color} strokeWidth="1" strokeDasharray="3 3" />
                  <text
                    x={ex}
                    y={d.radiusDir.dy < 0 ? ey - 8 : ey + 16}
                    textAnchor="middle"
                    className="fill-slate-300 font-mono text-[11px]"
                  >
                    {R_KM} km
                  </text>
                </g>
              );
            })}

            {/* Garis hop antar perangkat */}
            <line x1={DEVICES[0].x} y1={DEVICES[0].y} x2={DEVICES[1].x} y2={DEVICES[1].y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 4" />
            <line x1={DEVICES[1].x} y1={DEVICES[1].y} x2={DEVICES[2].x} y2={DEVICES[2].y} stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 4" />

            {/* --- Animasi paket data & ACK, disinkronkan ke "clock" --- */}
            {/* Hop 1: End-Device -> Extender */}
            <MovingPacket path={pathEndExt} begin="clock.begin+0s" dur={1.6} color={DEVICES[0].color} />
            <ArrivalPing x={DEVICES[1].x} y={DEVICES[1].y} color={DEVICES[0].color} begin="clock.begin+1.6s" />
            {/* ACK 1: Extender -> End-Device */}
            <MovingPacket path={pathExtEnd} begin="clock.begin+1.6s" dur={1.2} color={DEVICES[1].color} size={4.5} ring />
            <ArrivalPing x={DEVICES[0].x} y={DEVICES[0].y} color={DEVICES[1].color} begin="clock.begin+2.8s" dur={0.6} />

            {/* Hop 2: Extender -> Gateway (diteruskan begitu Extender menerima) */}
            <MovingPacket path={pathExtGw} begin="clock.begin+1.6s" dur={1.6} color={DEVICES[1].color} />
            <ArrivalPing x={DEVICES[2].x} y={DEVICES[2].y} color={DEVICES[1].color} begin="clock.begin+3.2s" />
            {/* ACK 2: Gateway -> Extender */}
            <MovingPacket path={pathGwExt} begin="clock.begin+3.2s" dur={1.2} color={DEVICES[2].color} size={4.5} ring />
            <ArrivalPing x={DEVICES[1].x} y={DEVICES[1].y} color={DEVICES[2].color} begin="clock.begin+4.4s" dur={0.6} />

            {/* Node perangkat */}
            {DEVICES.map((d) => {
              const Icon = d.icon;
              const isDim = selected && selected !== d.id;
              return (
                <g
                  key={`node-${d.id}`}
                  className="cursor-pointer"
                  opacity={isDim ? 0.45 : 1}
                  onClick={() => setSelected(selected === d.id ? null : d.id)}
                >
                  {/* denyut ambient menandakan perangkat aktif */}
                  <circle cx={d.x} cy={d.y} r="22" fill="none" stroke={d.color} strokeWidth="1.5" opacity="0.5">
                    <animate attributeName="r" values="22;32;22" dur="3s" begin={`${DEVICES.indexOf(d) * 0.4}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" begin={`${DEVICES.indexOf(d) * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.x} cy={d.y} r="20" fill="#0f172a" stroke={d.color} strokeWidth={selected === d.id ? 3 : 2} />
                  <foreignObject x={d.x - 12} y={d.y - 12} width="24" height="24">
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="h-4 w-4" style={{ color: d.color }} />
                    </div>
                  </foreignObject>
                  <text
                    x={d.x}
                    y={d.y + 40}
                    textAnchor={d.labelAnchor}
                    className="fill-white text-[13px] font-semibold"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Kontrol & telemetri */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-pressed={isPlaying}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? 'Jeda' : 'Mainkan'}
              </button>
              <button
                type="button"
                onClick={handleReplay}
                className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Ulangi
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300">
              <Gauge className="h-3.5 w-3.5 text-blue-400" />
              RSSI {telemetry.rssi} dBm &middot; SNR {telemetry.snr} dB
              <span className="text-slate-500">(simulasi, di Gateway)</span>
            </div>
          </div>
        </div>

        {/* Legenda + panel info perangkat terpilih */}
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DEVICES[0].color }} />
              Paket data, hop End-Device &rarr; Extender
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DEVICES[1].color }} />
              Paket data, hop Extender &rarr; Gateway
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-400 bg-white" />
              Balasan ACK (konfirmasi diterima)
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-slate-400" />
              Radius jangkauan &asymp; 5 km per perangkat
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            {activeDevice ? (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {activeDevice.name} &middot; {activeDevice.role}
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{activeDevice.note}</p>
              </>
            ) : (
              <p className="text-slate-500 dark:text-slate-500">
                Klik salah satu perangkat pada diagram untuk melihat perannya. Posisi tiap node sengaja diatur tepat di ujung radius tetangganya &mdash; kondisi jangkauan terjauh yang masih saling ter-cover.
              </p>
            )}
            {reducedMotionNotice && (
              <p className="mt-2 border-t border-slate-200 pt-2 text-slate-400 dark:border-zinc-800">
                Animasi dijeda otomatis mengikuti pengaturan &quot;reduced motion&quot; perangkat Anda. Tekan &quot;Mainkan simulasi&quot; untuk melihatnya bergerak.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* KOMPONEN UTAMA                                                      */
/* ------------------------------------------------------------------ */
export default function HowItWorksContent() {
  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-16 duration-700">
      {/* HEADER SECTION */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Bagaimana Sistem Ini Bekerja?
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
          Dari denyut nadi di atas gunung hingga tampil di layar pemantauan.
          Pelajari bagaimana gelombang radio dan arsitektur multi-hop memastikan
          tidak ada sinyal yang tertinggal.
        </p>
      </div>

      {/* SIMULASI JANGKAUAN & TRANSMISI PAKET */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Signal className="h-8 w-8 text-emerald-500" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Simulasi Jangkauan &amp; Estafet Paket
          </h2>
        </div>
        <p className="max-w-3xl text-slate-600 dark:text-slate-400">
          Tiap perangkat digambar dengan radius jangkauan 5 km. Perhatikan
          bagaimana Extender Node diposisikan tepat di tepi radius End-Device
          maupun Gateway &mdash; skenario jangkauan maksimum di mana sinyal
          masih tertangkap. Tekan tombol putar untuk melihat paket data
          &quot;melompat&quot; dari satu perangkat ke perangkat berikutnya, lengkap
          dengan balasan ACK setiap kali paket diterima.
        </p>
        <CoverageSimulation />
      </section>

      {/* THEORY SECTION: CHIRP SPREAD SPECTRUM */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AudioWaveform className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Rahasia LoRa: Chirp Spread Spectrum (CSS)
          </h2>
        </div>
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardContent className="p-0 sm:flex">
            <div className="flex flex-col justify-center space-y-4 p-6 sm:w-1/2">
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Berbeda dengan WiFi atau Bluetooth yang menggunakan frekuensi
                statis, LoRa menggunakan <strong>Chirps</strong> (kicauan).
                Sinyal ini menyapu pita frekuensi dari bawah ke atas (Up-Chirp)
                atau atas ke bawah (Down-Chirp) secara konstan.
              </p>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Karena sinyal ini bergerak melintasi spektrum, ia menjadi kebal
                terhadap <em>noise</em> (gangguan) di satu frekuensi tertentu.
                Ini memungkinkan penerima (Gateway) mendengarkan sinyal meskipun
                kekuatan sinyal tersebut berada di bawah tingkat kebisingan
                latar belakang (SNR negatif). Inilah yang membuatnya mampu
                menembus hambatan alam ekstrem.
              </p>
            </div>
            {/* Visualisasi CSS Sederhana */}
            <div className="relative flex min-h-[250px] flex-col items-center justify-center bg-slate-900 p-6 sm:w-1/2">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_24px]"></div>
              <div className="relative z-10 flex h-32 w-full items-end justify-around opacity-80">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-t-full bg-blue-500"
                    style={{
                      height: `${(i + 1) * 15}%`,
                      animation: `pulse 1.5s infinite ${i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
              <p className="z-10 mt-4 font-mono text-sm text-blue-400">
                Up-Chirp Frequency Sweep
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TOPOLOGY & DATA FLOW TIMELINE */}
      <section className="relative space-y-8">
        <div className="mb-8 flex items-center gap-3">
          <Signal className="h-8 w-8 text-emerald-500" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Detail Tiap Tahap Alur Komunikasi
          </h2>
        </div>

        <div className="absolute top-24 bottom-0 left-[27px] hidden w-0.5 -translate-x-1/2 bg-slate-200 md:left-1/2 md:block dark:bg-zinc-800"></div>

        {/* Step 1: End-Device */}
        <div className="group relative flex flex-col items-center gap-8 md:flex-row">
          <div className="flex justify-end text-right md:w-1/2 md:pr-12">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                1. End-Device (Pemancar)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Alat yang dikenakan merekam data vital (Suhu, Tekanan, Detak
                Jantung, SpO2) dan koordinat GPS. Data dimampatkan menjadi paket
                biner kecil berukuran <strong>25-byte</strong>, lalu dipancarkan
                ke udara melalui frekuensi 433MHz. Jika tombol darurat ditekan
                atau alat mendeteksi benturan, transmisi dilakukan seketika
                (Bypass).
              </p>
            </div>
          </div>
          <div className="absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-emerald-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900">
            <Activity className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="opacity-0 md:w-1/2 md:pl-12 md:opacity-100"></div>
        </div>

        <div className="my-4 flex justify-center md:hidden">
          <ArrowDown className="text-slate-300" />
        </div>

        {/* Step 2: Extender Node */}
        <div className="group relative flex flex-col items-center gap-8 md:flex-row">
          <div className="opacity-0 md:w-1/2 md:pr-12 md:opacity-100"></div>
          <div className="absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-amber-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900">
            <Radio className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex justify-start text-left md:w-1/2 md:pl-12">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                2. Extender Node (Repeater)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Dipasang di titik-titik tinggi untuk memperluas jangkauan.
                Extender menangkap sinyal 25-byte tersebut, memvalidasi agar
                tidak terjadi pengulangan (Anti-Looping), menambahkan ID rutenya
                sendiri ke dalam paket, menyimpannya di antrean (Circular
                Buffer), dan memancarkannya kembali ke arah Base Station.
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 flex justify-center md:hidden">
          <ArrowDown className="text-slate-300" />
        </div>

        {/* Step 3: Gateway */}
        <div className="group relative flex flex-col items-center gap-8 md:flex-row">
          <div className="flex justify-end text-right md:w-1/2 md:pr-12">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                3. Gateway (Base Station)
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Penerima akhir di posko keselamatan. Gateway menerjemahkan
                struktur biner radio, membaca kualitas kekuatan sinyal (RSSI)
                dan tingkat kebisingan (SNR). Jika terdeteksi bendera (flag)
                darurat, alarm lokal akan berbunyi. Gateway kemudian membungkus
                data tersebut ke dalam format JSON.
              </p>
            </div>
          </div>
          <div className="absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-blue-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900">
            <Cpu className="h-6 w-6 text-blue-500" />
          </div>
          <div className="opacity-0 md:w-1/2 md:pl-12 md:opacity-100"></div>
        </div>

        <div className="my-4 flex justify-center md:hidden">
          <ArrowDown className="text-slate-300" />
        </div>

        {/* Step 4: Backend & Dashboard */}
        <div className="group relative flex flex-col items-center gap-8 md:flex-row">
          <div className="opacity-0 md:w-1/2 md:pr-12 md:opacity-100"></div>
          <div className="absolute left-0 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-purple-500 bg-white shadow-lg transition-transform group-hover:scale-110 md:left-1/2 dark:bg-zinc-900">
            <Database className="h-6 w-6 text-purple-500" />
          </div>
          <div className="flex justify-start text-left md:w-1/2 md:pl-12">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                4. Cloud Backend &amp; UI
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
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